const { Server } = require('socket.io')
const models = require('../models')
const crypto = require('crypto')

const activeSessions = {}

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, { cors: { origin: '*' } })

  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('createSession', async ({ quizId, userId }) => {
      const sessionKey = crypto.randomBytes(3).toString('hex').toUpperCase()

      const quiz = await models.core.Quiz.findById(quizId)
      if (!quiz) {
        socket.emit('error', 'Quiz not found')
        return
      }

      const session = new models.core.Session({
        key: sessionKey,
        quiz: quizId,
        players: [{ user: userId, score: 0 }],
        status: 'waiting'
      })

      await session.save()
      activeSessions[sessionKey] = session

      socket.join(sessionKey)
      socket.emit('sessionCreated', { key: sessionKey })
      const populatedSession = await models.core.Session.findOne({ key: sessionKey }).populate('players.user')
      io.to(sessionKey).emit('playerListUpdate', populatedSession.players)
    })

    socket.on('joinSession', async ({ sessionKey, userId }) => {
      let session = await models.core.Session.findOne({ key: sessionKey }).populate('quiz').populate('players.user')
      if (!session) {
        socket.emit('error', 'Session not found')
        return
      }

      if (session.players.length >= 4) {
        socket.emit('error', 'Session is full')
        return
      }

      if (session.status !== 'waiting') {
        socket.emit('error', 'Game has already started')
        return
      }

      session.players.push({ user: userId, score: 0 })
      await session.save()

      session = await models.core.Session.findOne({ key: sessionKey })
        .populate('quiz')
        .populate('players.user')

      activeSessions[sessionKey] = session

      socket.join(sessionKey)
      io.to(sessionKey).emit('playerListUpdate', session.players)
      socket.emit('joinSuccess', { quizId: session.quiz._id, sessionKey, players: session.players })
    })

    socket.on('startGame', async ({ sessionKey }) => {
      let session = activeSessions[sessionKey]

      if (!session) {
        socket.emit('error', 'Session not found')
        return
      }

      session = await models.core.Session.findOne({ key: sessionKey }).populate({
        path: 'quiz',
        populate: { path: 'questions' }
      })

      if (!session || !session.quiz || !session.quiz.questions || session.quiz.questions.length === 0) {
        socket.emit('error', 'Quiz or questions not found')
        return
      }

      session.status = 'in-progress'
      session.currentQuestionIndex = 0
      await session.save()

      activeSessions[sessionKey] = session

      io.to(sessionKey).emit('gameStarted', { questionId: session.quiz.questions[0]._id })

      if (!activeSessions[sessionKey].timerRunning) {
        activeSessions[sessionKey].timerRunning = true

        const runQuestionTimer = async () => {
          let session = await models.core.Session.findOne({ key: sessionKey }).populate({
            path: 'quiz',
            populate: { path: 'questions' }
          })

          if (!session || session.currentQuestionIndex >= session.quiz.questions.length) {
            session.status = 'finished'
            await session.save()
            io.to(sessionKey).emit('gameFinished')

            // // Delay cleanup to allow the leaderboard to be displayed
            // setTimeout(async () => {
            //   // Populate players to get full user details
            //   session = await models.core.Session.findOne({ key: sessionKey }).populate('players.user')
            //   // For each player, delete temporary users
            //   for (const player of session.players) {
            //     if (player.user && player.user.isTemporaryUser) {
            //       await models.core.User.deleteOne({ _id: player.user._id })
            //     }
            //   }
            //   // Delete the session from the database
            //   await models.core.Session.deleteOne({ _id: session._id })
            //   delete activeSessions[sessionKey]
            // }, 10000) // 10-second delay before cleanup
            return
          }

          let timeLeft = 10
          io.to(sessionKey).emit('timerUpdate', { timeLeft })

          const interval = setInterval(async () => {
            timeLeft--
            io.to(sessionKey).emit('timerUpdate', { timeLeft })

            if (timeLeft === 0) {
              if (timeLeft === 0) {
                clearInterval(interval)
                const currentQuestion = session.quiz.questions[session.currentQuestionIndex]
                io.to(sessionKey).emit('questionFeedback', { correctAnswer: currentQuestion.correctAnswer })
                setTimeout(async () => {
                  session = await models.core.Session.findOne({ key: sessionKey }).populate({
                    path: 'quiz',
                    populate: { path: 'questions' }
                  })
                  session.currentQuestionIndex++
                  if (session.currentQuestionIndex < session.quiz.questions.length) {
                    const nextQuestionId = session.quiz.questions[session.currentQuestionIndex]._id
                    io.to(sessionKey).emit('nextQuestion', { questionId: nextQuestionId })
                    await session.save()
                    activeSessions[sessionKey] = session
                    runQuestionTimer()
                  } else {
                    session.status = 'finished'
                    await session.save()
                    io.to(sessionKey).emit('gameFinished')
                    setTimeout(async () => {
                      session = await models.core.Session.findOne({ key: sessionKey }).populate('players.user')
                      for (const player of session.players) {
                        if (player.user && player.user.isTemporaryUser) {
                          await models.core.User.deleteOne({ _id: player.user._id })
                        }
                      }
                      await models.core.Session.deleteOne({ _id: session._id })
                      delete activeSessions[sessionKey]
                    }, 10000)
                  // Delete temporary guest users
                  // for (const player of session.players) {
                  //   if (player.user && player.user.isTemporaryUser) {
                  //     await models.core.User.deleteOne({ _id: player.user._id })
                  //   }
                  // }
                  // Delete the session
                  // await models.core.Session.deleteOne({ _id: session._id })
                  // delete activeSessions[sessionKey]
                  }
                }, 3000)
              }
            }
          }, 1000)
        }

        runQuestionTimer()
      }
    })

    socket.on('submitAnswer', async ({ sessionKey, userId, answer }) => {
      const session = activeSessions[sessionKey]

      if (!session) {
        socket.emit('error', 'Session not found')
        return
      }
      const question = await models.core.Question.findById(session.quiz.questions[session.currentQuestionIndex])
      const player = session.players.find(p => p.user.toString() === userId)

      if (question.correctAnswer === answer) {
        player.score += question.points
      }

      await session.save()
      io.to(sessionKey).emit('scoreUpdate', session.players)
    })

    socket.on('getLeaderboard', async ({ sessionKey }) => {
      try {
        const session = await models.core.Session.findOne({ key: sessionKey }).populate('players.user')
        if (session) {
          io.to(sessionKey).emit('leaderboardUpdate', session.players)
        }
      } catch (error) {
        socket.emit('error', 'Error retrieving leaderboard')
      }
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected')
    })
  })
}

module.exports = initializeSocket
