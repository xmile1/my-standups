const fs = require('fs')
const db = require('../db.json')
const { dateString } = require('./util')
const path = require('path')
const UPDATE_TYPES = {
  DONE: 'done',
  TODO: 'todo',
  BLOCKER: 'blocker'
}
const days = ['MO', 'DI', 'MI', 'DO', 'FR']

function addStandupUpdate (text, blocker, todo, date = new Date()) {
  addToDatabase(db, UPDATE_TYPES.DONE, text, date)
  addToDatabase(db, UPDATE_TYPES.BLOCKER, blocker, date)
  addToDatabase(db, UPDATE_TYPES.TODO, todo, date)
  fs.writeFile(path.join(__dirname, '..', 'db.json'), JSON.stringify(db, null, 2), 'utf8', (e) => {
    if (e) {
      console.log(e, 'error')
    }
  })
}

function addToDatabase (database, type, text, date) {
  if (text) {
    let item = database.docu[dateString(date)]
    const processedText = text.replace(/[*•]/g, '').split('\n')

    if (item && item[type]) {
      database.docu[dateString(date)][type].push(...processedText)
    } else if (item && !item[type]) {
      database.docu[dateString(date)][type] = [...processedText]
    } else if (!item) {
      database.docu[dateString(date)] = { [type]: [...processedText] }
    }
  }
}

function generateStandupForSlack (date = new Date()) {
  console.log(date, 'date')
  const lastStandup = new Date(date)
  const currentData = db.docu[dateString(date)]
  if (lastStandup.getDay() === 1) {
    lastStandup.setDate(lastStandup.getDate() - 3)
  } else {
    lastStandup.setDate(lastStandup.getDate() - 1)
  }
  const prevData = db.docu[dateString(lastStandup)]
  const body = `*Done*:
 * ${prevData && prevData.done ? prevData.done.join('\n * ') : ''}

*Problems*
  * ${prevData && prevData.blocker ? prevData.blocker.join('\n  * ') : ''}

*Today*:
  * ${currentData && currentData.todo ? currentData.todo.join('\n  * ') : ''}
  * leave around 4:30pm
        `
  console.log(body)
}

function generateDoneForTimesheet (date = new Date(), month) {
  let body = ''
  for (let i = 0; i < 5; i++) {
    const day = new Date(date)
    day.setDate(day.getDate() + i)
    body += `${days[i]}. ${db.docu[dateString(day)] && db.docu[dateString(day)].done ? db.docu[dateString(day)].done.join(', ') : ''}\n`
  }
  console.log(body)
}

module.exports = {
  addStandupUpdate,
  addToDatabase,
  generateStandupForSlack,
  generateDoneForTimesheet
}
