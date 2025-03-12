'use strict'
const fs = require('fs')

const addDirectory = (directory) => {
  const items = fs.readdirSync(directory)
  const results = {}
  for (const item of items) {
    if (fs.statSync(`${directory}/${item}`).isDirectory()) {
      const parts = item.split('/')
      const prefix = parts[parts.length - 1]
      // results[prefix] = prefix
      results[prefix] = addDirectory(`${directory}/${item}`)
    } else {
      if (item !== 'index.js') {
        const fileName = item.split('.')[0]
        const nameItems = fileName.split('-')
        const moduleName = nameItems.slice(0, nameItems.length - 1).map((e, i) => i === 0 ? e : e[0].toUpperCase() + e.slice(1, e.length)).reduce((a, e) => a + e, '')
        results[moduleName] = require(`${directory}/${fileName}`)
      }
    }
  }
  return results
}

module.exports = addDirectory(__dirname)
