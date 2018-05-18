const _ = require('lodash')

module.exports = function parseNotes (names, groups) {
  return names.map(name => groups[name]).filter(_.isString).map(_.trim).filter(note => !_.isEmpty(note))
}
