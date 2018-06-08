const _ = require('lodash')

const Entry = require('./Entry')
const Link = require('./Link')
const mergeLinks = require('./mergeLinks')

function parseModels ({ links = [], entries = [] }) {
  return {
    links: links.map(row => new Link(row)),
    entries: entries.map(row => new Entry(row))
  }
}

function mergeLinksToEntries ({ links, entries }) {
  return {
    links: links.map(link => ({
      lemmas: link.lemmas,
      targets: link.targets,
      source: link.source
    })),
    ...mergeLinks(entries, links)
  }
}

function countDuplicates (result) {
  return {
    ...result,
    duplicates: _(result.entries)
      .filter(entry => !!entry.lemma)
      .countBy(entry => `${entry.lemma.join(' ')} ${entry.homonym}`)
      .pickBy(_.partial(_.lt, 1))
      .value()
  }
}

module.exports = function parse (rows) {
  return _(rows)
    .map(_.trim)
    .reject(_.isEmpty)
    .groupBy(row => Link.isLink(row) ? 'links' : 'entries')
    .thru(parseModels)
    .thru(mergeLinksToEntries)
    .thru(countDuplicates)
    .value()
}
