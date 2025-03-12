/**
 * @module Quiz
 * @description Schema for a quiz
 * @category models/core
 */
'use strict'
const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, 
  isPublic: { type: Boolean, default: false }, 
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  maxPlayers: { type: Number, default: 4 } 
}, {
  timestamps: true
})

module.exports = mongoose.model('Quiz', QuizSchema)
