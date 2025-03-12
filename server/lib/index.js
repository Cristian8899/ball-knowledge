'use strict'
const fs = require('fs')

// load all models
fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.js' && file !== 'assets') {
    const fileName = file.split('.')[0]
    const items = fileName.split('-')
    const moduleName = items[0] + items.slice(1, items.length - 1).map((e) => e[0].toUpperCase() + e.slice(1, e.length)).reduce((a, e) => a + e, '')
    exports[moduleName] = require('./' + fileName)
  }
})
