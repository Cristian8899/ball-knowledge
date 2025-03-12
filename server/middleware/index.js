'use strict'
const fs = require('fs')

// load all routers
fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.js') {
    // const keyName = file.split('.')[0].split('-')[0]
    const keyNameItems = file.split('.')[0].split('-')
    const keyName = keyNameItems.slice(0, keyNameItems.length - 1).map((e, i) => i === 0 ? e : e[0].toUpperCase() + e.slice(1, e.length)).reduce((a, e) => a + e, '')
    const moduleName = file.split('.')[0]
    exports[keyName] = require('./' + moduleName)
  }
})
