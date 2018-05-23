module.exports = class Link {
  static isLink (string) {
    const linkRexExp = /^(?:\*\*(?:\\\*)?[^\s]+\*\*(?:, | )?)+\s(?:etc\. )?\*cf\.\*?/
    return linkRexExp.test(string)
  }

  constructor (row) {
    this.source = row
  }
}
