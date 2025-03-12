const models = require('../../models')
const libs = require('../../lib')

const postQuiz = async (req, res, next) => {
  try {
    const { title, category, difficulty, isPublic, owner, questions } = req.body

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: libs.responseDetails.ERR_BAD_REQUEST })
    }

    const existingQuiz = await models.core.Quiz.findOne({ title })
    if (existingQuiz) {
      return res.status(403).json({ message: libs.responseDetails.ERR_EXISTS })
    }

    const formattedQuestions = questions.map(q => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: Number(q.correctAnswer)
    }))

    const questionDocs = await models.core.Question.insertMany(formattedQuestions)

    const newQuiz = new models.core.Quiz({
      title,
      category: category || 'General',
      difficulty: difficulty || 'Medium',
      owner: owner || null,
      isPublic: isPublic || false,
      questions: questionDocs.map(q => q._id)
    })

    await newQuiz.save()
    res.status(201).json({ message: libs.responseDetails.CREATED })
  } catch (e) {
    next(e)
  }
}

const putQuiz = async (req, res, next) => {
  try {
    const quiz = await models.core.Quiz.findById(req.params.qid)

    if (!quiz) {
      return res.status(404).json({ message: libs.responseDetails.ERR_NOT_FOUND })
    }

    if (!req.body.title || !req.body.questions || req.body.questions.length === 0) {
      return res.status(400).json({ message: libs.responseDetails.ERR_BAD_REQUEST })
    }

    const { title, category, difficulty, isPublic, questions } = req.body

    const ALLOWED_DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard']
    quiz.difficulty = ALLOWED_DIFFICULTY_LEVELS.includes(difficulty) ? difficulty : 'Medium'

    const existingQuestions = await models.core.Question.find({ _id: { $in: quiz.questions } })
    const existingQuestionMap = new Map(existingQuestions.map(q => [q._id.toString(), q]))

    const updatedQuestionIds = []

    for (const q of questions) {
      let question

      if (q._id && existingQuestionMap.has(q._id)) {
        question = existingQuestionMap.get(q._id)
        question.questionText = q.questionText.trim()
        question.options = q.options.map(opt => opt.trim())
        question.correctAnswer = Number(q.correctAnswer)
        await question.save()
      } else {
        question = new models.core.Question({
          questionText: q.questionText.trim(),
          options: q.options.map(opt => opt.trim()),
          correctAnswer: Number(q.correctAnswer)
        })
        await question.save()
      }

      updatedQuestionIds.push(question._id)
    }

    await models.core.Question.deleteMany({ _id: { $in: quiz.questions.filter(qid => !updatedQuestionIds.includes(qid.toString())) } })

    quiz.questions = updatedQuestionIds
    quiz.title = title.trim()
    quiz.category = category?.trim() || 'General'
    quiz.isPublic = isPublic ?? false

    await quiz.save()

    return res.status(202).json({ message: libs.responseDetails.ACCEPTED, id: quiz._id })
  } catch (e) {
    next(e)
  }
}

const deleteCreatedQuiz = async (req, res, next) => {
  try {
    const { uid, qid } = req.params
    const quiz = await models.core.Quiz.findOneAndDelete({ _id: qid, owner: uid })

    if (!quiz) {
      return res.status(404).json({ message: libs.responseDetails.ERR_NOT_FOUND })
    }

    res.status(202).json({ message: libs.responseDetails.ACCEPTED })
  } catch (e) {
    next(e)
  }
}

const getPublicQuiz = async (req, res, next) => {
  try {
    const { qid } = req.params
    const quiz = await models.core.Quiz.findById(qid)

    if (!quiz) {
      return res.status(404).json({ message: libs.responseDetails.ERR_NOT_FOUND })
    }

    res.status(200).json({ quiz })
  } catch (e) {
    next(e)
  }
}

const getRandomQuiz = async (req, res, next) => {
  try {
    const count = await models.core.Quiz.countDocuments({ isPublic: true })

    if (count === 0) {
      return res.status(404).json({ message: libs.responseDetails.ERR_NOT_FOUND })
    }

    const randomIndex = Math.floor(Math.random() * count)
    const randomQuiz = await models.core.Quiz.findOne({ isPublic: true }).skip(randomIndex)

    if (!randomQuiz) {
      return res.status(404).json({ message: libs.responseDetails.ERR_NOT_FOUND })
    }

    res.status(200).json({ randomQuizId: randomQuiz._id })
  } catch (e) {
    next(e)
  }
}

const getCreatedQuiz = async (req, res, next) => {
  try {
    const { uid, qid } = req.params
    const quiz = await models.core.Quiz.findOne({ _id: qid.toObjectId(), owner: uid.toObjectId() }).populate('questions')

    if (!quiz) {
      return res.status(404).json({ message: libs.responseDetails.ERR_NOT_FOUND })
    }

    res.status(200).json({ quiz })
  } catch (e) {
    next(e)
  }
}

const getPublicQuizzes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 5
    const skip = (page - 1) * pageSize

    const quizFilters = { isPublic: true }
    if (req.query.category) {
      quizFilters.category = req.query.category
    }
    if (req.query.difficulty) {
      quizFilters.difficulty = req.query.difficulty
    }

    const count = await models.core.Quiz.countDocuments(quizFilters)

    const quizzes = await models.core.Quiz.find(quizFilters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)

    return res.status(200).json({ quizzes, count })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const getCreatedQuizzes = async (req, res, next) => {
  try {
    const { uid } = req.params
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 5
    const skip = (page - 1) * pageSize

    const quizFilters = { owner: uid }
    if (req.query.category) {
      quizFilters.category = req.query.category
    }
    if (req.query.difficulty) {
      quizFilters.difficulty = req.query.difficulty
    }

    const count = await models.core.Quiz.countDocuments(quizFilters)

    const quizzes = await models.core.Quiz.find(quizFilters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)

    return res.status(200).json({ quizzes, count })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  postQuiz,
  putQuiz,
  deleteCreatedQuiz,
  getPublicQuiz,
  getCreatedQuiz,
  getPublicQuizzes,
  getRandomQuiz,
  getCreatedQuizzes
}
