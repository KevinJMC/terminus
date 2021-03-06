let lru = require('lru-cache')({ max: 256, maxAge: 250 })

let fs = require('fs')
let origLstat = fs.realpathSync.bind(fs)

// NB: The biggest offender of thrashing realpathSync is the node module system
// itself, which we can't get into via any sane means.
require('fs').realpathSync = function (p) {
    let r = lru.get(p)
    if (r) return r

    r = origLstat(p)
    lru.set(p, r)
    return r
}
