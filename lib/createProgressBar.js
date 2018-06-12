const _ = require('lodash')
const ProgressBar = require('progress')

module.exports = function createProgressBar (title, total) {
  return new ProgressBar(`${_.padEnd(title, 32)} [:bar] :percent :etas`, {total: total, width: 50, renderThrottle: 1000})
}
