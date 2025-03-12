/**
 * @module Question
 * @description Schema for a question
 * @category models/core
 */
'use strict'
const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  points: { type: Number, default: 10 }
}, {
  timestamps: true
})

module.exports = mongoose.model('Question', QuestionSchema)
