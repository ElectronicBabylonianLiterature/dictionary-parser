const _ = require('lodash')

module.exports = function parseNotes (indices, match) {
  return indices.map(i => match[i]).filter(_.isString).map(_.trim).filter(note => !_.isEmpty(note))
}
