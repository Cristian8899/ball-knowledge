/**
 * @module User
 * @description Schema for a user
 * @category models/core
 */

'use strict'
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, dropDups: true },
  fullName: String,
  passwordHash: String,
  passwordSalt: String,
  email: { type: String },
  facets: [{ type: String }],
  enabled: { type: Boolean, default: true },
  token: String,
  isTemporaryUser: { type: Boolean, default: false }
}, { timestamps: true })

UserSchema.post('save', (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    const duplicateError = new Error('Duplicate entry: This username or email already exists.')
    duplicateError.statusCode = 409
    next(duplicateError)
  } else {
    next(error)
  }
})

module.exports = mongoose.model('User', UserSchema)
