'use strict'
const fs = require('fs')

fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.js' && file !== 'controllers' && file !== 'modules') {
    const keyName = file.split('.')[0].split('-')[0]
    const moduleName = file.split('.')[0]
    exports[keyName] = require('./' + moduleName)
  }
})
