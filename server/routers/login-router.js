const express = require('express')
const controllers = require('./controllers')

const router = express.Router()

router.post('/user', controllers.user.loginUser)
router.post('/register', controllers.user.registerUser)
router.post('/guest-users', controllers.user.createGuestUser)
router.delete('/', controllers.user.logout)

module.exports = router
