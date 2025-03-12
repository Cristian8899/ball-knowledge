/**
 * @module Session
 * @description Schema for a session
 * @category models/core
 */
'use strict'
const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  key: { type: String, unique: true, required: true },
  players: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number, default: 0 }
    }
  ],
  status: { type: String, enum: ['waiting', 'in-progress', 'finished'], default: 'waiting' },
  currentQuestionIndex: { type: Number, default: 0 },
  timeLeft: { type: Number, default: 30 }
})

module.exports = mongoose.model('Session', SessionSchema)
