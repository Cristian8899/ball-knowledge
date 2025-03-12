'use strict'

const dotenv = require('dotenv')
dotenv.config()
const http = require('http')
const initApp = require('./app')
const initializeSocket = require('./lib/socket')

String.prototype.toObjectId = function () {
  const ObjectId = (require('mongoose').Types.ObjectId)
  return new ObjectId(this.toString())
}

initApp()
  .then((app) => {
    const httpServer = http.createServer(app)
    const PORT = process.env.MODE === 'DEV' ? 8081 : process.env.PORT || 8081

    initializeSocket(httpServer)

    httpServer.listen(PORT, () => {
      console.warn(`🚀 Server started on port ${PORT} (${process.env.MODE})`)
    })
  })
  .catch((err) => {
    console.warn(err)
  })
