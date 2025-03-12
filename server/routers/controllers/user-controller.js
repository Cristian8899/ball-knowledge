const auth = require('basic-auth')
const crypto = require('crypto')
const dayjs = require('dayjs')
const libs = require('../../lib')
const models = require('../../models/index.js')
const { Buffer } = require('buffer')

const loginUser = async (request, response, next) => {
  try {
    const userData = auth(request)
    if (!userData || !userData.name || !userData.pass) {
      response.status(401).send(libs.responseDetails.ERR_NOT_AUTHORIZED)
    } else {
      const user = await models.core.User.findOne({
        username: userData.name
      })
      if (user) {
        if (
          user.passwordHash &&
            libs.secureHash.checkHash(user, userData.pass)
        ) {
          const token = Buffer.from(
            crypto.randomFillSync(new Uint8Array(16))
          ).toString('base64')
          user.token = token
          user.expiry = dayjs().add(1, 'day').toDate()
          await user.save()
          response.status(200).json({
            message: libs.responseDetails.LOGIN_OK,
            data: {
              token,
              _id: user._id,
              username: user.username,
              fullName: user.fullName,
              email: user.email,
              facets: user.facets,
              token: user.token,
              expiry: user.expiry
            }
          })
        } else {
          response
            .status(401)
            .json({ message: libs.responseDetails.ERR_NO_CREDENTIALS })
        }
      } else {
        response
          .status(404)
          .json({ message: libs.responseDetails.ERR_NO_CREDENTIALS })
      }
    }
  } catch (e) {
    next(e)
  }
}

const registerUser = async (req, res, next) => {
  try {
    const { username, password, fullName, email } = req.body

    if (!username || !password || !fullName || !email) {
      return res.status(400).json({ message: libs.responseDetails.ERR_BAD_REQUEST })
    }

    const existingUser = await models.core.User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: libs.responseDetails.ERR_EXISTS })
    }

    const { passwordSalt, passwordHash } = libs.secureHash.getHashAndSalt(password)

    const user = new models.core.User({
      username,
      fullName,
      email,
      passwordHash,
      passwordSalt,
      token: null
    })

    await user.save()
    res.status(201).json({ message: libs.responseDetails.REGISTER_OK })
  } catch (e) {
    next(e)
  }
}

const createGuestUser = async (req, res, next) => {
  try {
    const { username, fullName } = req.body

    if (!username || !fullName) {
      return res.status(400).json({ message: libs.responseDetails.ERR_BAD_REQUEST })
    }

    const existingUser = await models.core.User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: libs.responseDetails.ERR_BAD_REQUEST })
    }

    const token = Buffer.from(crypto.randomFillSync(new Uint8Array(16))).toString('base64')

    const guestUser = new models.core.User({
      username,
      fullName,
      passwordHash: null,
      passwordSalt: null,
      email: null,
      token,
      expiry: dayjs().add(1, 'day').toDate(),
      isTemporaryUser: true
    })

    await guestUser.save()

    res.status(201).json({
      message: libs.responseDetails.ACCEPTED,
      data: {
        token,
        _id: guestUser._id,
        username: guestUser.username,
        fullName: guestUser.fullName,
        email: guestUser.email,
        facets: guestUser.facets,
        token: guestUser.token,
        expiry: guestUser.expiry,
        isTemporaryUser: guestUser.isTemporaryUser
      }
    })
  } catch (e) {
    next(e)
  }
}

const logout = async (req, res, next) => {
  try {
    return res.status(202).json({ message: libs.responseDetails.ACCEPTED })
  } catch (e) {
    next(e)
  }
}

module.exports = { loginUser, registerUser, createGuestUser, logout }
