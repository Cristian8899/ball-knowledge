const models = require('../../models')
const libs = require('../../lib')

const generateSessionKey = () => Math.random().toString(36).substr(2, 6).toUpperCase()

const startQuizSession = async (req, res, next) => {
  try {
    const { quizId } = req.params
    const quiz = await models.core.Quiz.findById(quizId)

    if (!quiz) {
      return res.status(404).json({ message: libs.responseDetails.ERR_NOT_FOUND })
    }

    // Generate unique key
    let key
    let existingSession
    do {
      key = generateSessionKey()
      existingSession = await models.core.Session.findOne({ key })
    } while (existingSession)

    const newSession = new models.core.Session({ quiz: quizId, key })
    await newSession.save()

    res.status(201).json({ message: libs.responseDetails.CREATED })
  } catch (e) {
    next(e)
  }
}

const joinQuizSession = async (req, res, next) => {
  try {
    const { key } = req.body
    const { userId } = req.params

    const session = await models.core.Session.findOne({ key }).populate('quiz')

    if (!session) {
      return res.status(404).json({ message: libs.responseDetails.ERR_NOT_FOUND })
    }

    if (session.players.length >= session.quiz.maxPlayers) {
      return res.status(400).json({ message: libs.responseDetails.ERR_SESSION_FULL })
    }

    session.players.push({ user: userId })
    await session.save()

    res.status(200).json({ message: libs.responseDetails.ACCEPTED, session })
  } catch (e) {
    next(e)
  }
}

const submitAnswer = async (req, res, next) => {
  try {
    const { sessionId, questionId } = req.params
    const { userId, selectedAnswer } = req.body

    const session = await models.core.Session.findById(sessionId).populate('quiz')

    if (!session) {
      return res.status(404).json({ message: libs.responseDetails.ERR_NOT_FOUND })
    }

    const question = await models.core.Question.findById(questionId)

    if (!question) {
      return res.status(404).json({ message: libs.responseDetails.ERR_NOT_FOUND })
    }

    const player = session.players.find(p => p.user.toString() === userId)
    if (!player) {
      return res.status(400).json({ message: libs.responseDetails.ERR_NO_PLAYER })
    }

    if (question.correctAnswer === selectedAnswer) {
      player.score += 10
    }

    await session.save()

    res.status(200).json({ message: libs.responseDetails.ACCEPTED, score: player.score })
  } catch (e) {
    next(e)
  }
}

const getLeaderboard = async (req, res, next) => {
  try {
    const { sessionId } = req.params

    const session = await models.core.Session.findById(sessionId).populate('players.user')

    if (!session) {
      return res.status(404).json({ message: libs.responseDetails.ERR_NOT_FOUND })
    }

    const leaderboard = session.players
      .map(player => ({
        username: player.user.username,
        score: player.score
      }))
      .sort((a, b) => b.score - a.score)

    res.status(200).json({ leaderboard })
  } catch (e) {
    next(e)
  }
}

module.exports = { joinQuizSession, startQuizSession, submitAnswer, getLeaderboard }
