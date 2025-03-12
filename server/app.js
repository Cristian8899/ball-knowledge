const http2Express = require('http2-express-bridge')
const path = require('path')

const initApp = async () => {
  const routers = require('./routers')
  const express = require('express')
  const mongoose = require('mongoose')
  const cors = require('cors')
  const fs = require('fs')

  if (process.env.USE_REMOTE_DB === 'true') {
    const certPath = process.env.MONGO_CERT_PATH
    if (!fs.existsSync(certPath)) {
      console.error('❌ MongoDB X.509 certificate file not found!')
      process.exit(1)
    }

    mongoose.connect(process.env.MONGO_REMOTE_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
      tlsCertificateKeyFile: certPath
    })
      .then(() => console.warn('✅ CONNECTED TO REMOTE DB'))
      .catch(err => console.warn('❌ Remote DB Connection Error:', err))
  } else {
    mongoose.connect(process.env.MONGO_LOCAL_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        mongoose.set('bufferCommands', false)
        console.warn('✅ CONNECTED TO LOCAL DB')
      })
      .catch(err => console.warn('❌ Local DB Connection Error:', err))
  }

  const app = http2Express(express)
  app.disable('x-powered-by')

  const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('❌ CORS blocked this request'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))

  app.use(express.json({ limit: '500mb' }))
  app.use(express.urlencoded({ extended: true }))

  // app.use('/', express.static(path.join(__dirname, 'webapp')))

  app.get('/', (req, res) => {
    res.send('⚽ Ball Knowledge API is running...')
  })
  app.use('/owner-api', routers.owner)
  app.use('/player-api', routers.player)
  app.use('/auth-api', routers.login)

  return app
}

module.exports = initApp
