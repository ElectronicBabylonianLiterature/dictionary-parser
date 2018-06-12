console.time('parse')
require('./lib/main')(process.argv[2], process.argv[3]).then(() => console.timeEnd('parse'))
