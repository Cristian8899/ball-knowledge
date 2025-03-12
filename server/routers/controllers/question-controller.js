const models = require('../../models')
const libs = require('../../lib')

const getQuizQuestion = async (req, res, next) => {
  try {
    const question = await models.core.Question.findOne(
      { _id: req.params.quid.toObjectId() },
      { correctAnswer: 0 }
    )

    if (!question) {
      return res.status(404).json({ message: libs.responseDetails.ERR_NOT_FOUND })
    }

    return res.status(200).json({ question })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

module.exports = { getQuizQuestion }
