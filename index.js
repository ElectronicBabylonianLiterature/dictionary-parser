console.time('parse')
require('./lib/main')(process.argv[2]).then(() => console.timeEnd('parse'))
