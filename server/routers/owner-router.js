const express = require('express')
const controllers = require('./controllers')
const middleware = require('../middleware')
const router = express.Router()

router.use(middleware.authentication)

router.get('/users/:uid/quizzes', controllers.quiz.getCreatedQuizzes)
router.get('/users/:uid/quizzes/:qid', controllers.quiz.getCreatedQuiz)
router.delete('/users/:uid/quizzes/:qid', controllers.quiz.deleteCreatedQuiz)
router.post('/quizzes', controllers.quiz.postQuiz)
router.put('/quizzes/:qid', controllers.quiz.putQuiz)
// router.delete('/quizzes/:qid', controllers.quiz.deleteQuiz)

module.exports = router
