const crypto = require('crypto')

const SALT_LENGTH = 16

const getHashAndSalt = (password) => {
  const salt = crypto.randomBytes(Math.ceil(SALT_LENGTH / 2)).toString('hex').slice(0, SALT_LENGTH)
  const hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  const value = hash.digest('hex')
  return {
    passwordSalt: salt,
    passwordHash: value
  }
}

const checkHash = (user, password) => {
  const salt = user.passwordSalt
  const hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  const value = hash.digest('hex')
  if (value === user.passwordHash) {
    return true
  }
  return false
}

module.exports = { getHashAndSalt, checkHash }
