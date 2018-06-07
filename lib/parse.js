const _ = require('lodash')

const Entry = require('./Entry')
const Link = require('./Link')
const mergeLinks = require('./mergeLinks')

module.exports = function parse (rows) {
  return _(rows)
    .map(_.trim)
    .reject(_.isEmpty)
    .groupBy(row => Link.isLink(row) ? 'links' : 'entries')
    .thru(({ links = [], entries = [] }) => ({
      links: links.map(row => new Link(row)),
      entries: entries.map(row => new Entry(row))
    }))
    .thru(({ links, entries }) => {
      return {
        links: links.map(link => ({
          lemmas: link.lemmas,
          targets: link.targets,
          source: link.source
        })),
        ...mergeLinks(entries, links)
      }
    })
    .value()
}
