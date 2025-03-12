'use strict'
const models = require('../models')
const lib = require('../lib')

const auth = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }

  const token = req.headers.authorization || req.headers.Authorization
  if (!token) {
    return res.status(401).json({ message: lib.responseDetails.ERR_NO_CREDENTIALS })
  }

  try {
    const user = await models.core.User.findOne({
      token
    })

    if (user) {
      res.locals.user = user
      return next()
    }

    return res.status(401).json({ message: lib.responseDetails.ERR_INCORRECT_TOKEN })
  } catch (error) {
    return next(error)
  }
}

module.exports = auth
