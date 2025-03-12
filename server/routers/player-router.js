const express = require('express')
const controllers = require('./controllers')

const router = express.Router()

router.get('/quizzes', controllers.quiz.getPublicQuizzes)
router.get('/random-quiz', controllers.quiz.getRandomQuiz)
router.get('/quizzes/:qid', controllers.quiz.getPublicQuiz)
router.get('/quizzes/:qid/questions/:quid', controllers.question.getQuizQuestion)

module.exports = router
