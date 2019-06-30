// moment isnt so useful here but there is no need for optimization yet
const moment = require('moment')
const dateString = (date) => {
  return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
}

const getDate = (dateString) => {
  switch (dateString) {
    case 'yesterday': return moment().subtract(1, 'day').toDate()
    case '2daysago': return moment().subtract(2, 'day').toDate()
    case 'lastfriday': return moment().day(-2).toDate()
    default: return moment(dateString).toDate()
  }
}

module.exports = {
  dateString,
  getDate
}
