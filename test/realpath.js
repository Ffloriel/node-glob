var glob = require('../')
var test = require('tap').test
// pattern to find a bunch of duplicates
var pattern = 'a/symlink/{*,**/*/*/*,*/*/**,*/*/*/*/*/*}'
process.chdir(__dirname)

// options, results
// realpath:true set on each option
var cases = [
  [ {},
    [ 'a/symlink', 'a/symlink/a', 'a/symlink/a/b' ] ],

  [ { mark: true },
    [ 'a/symlink/', 'a/symlink/a/', 'a/symlink/a/b/' ] ],

  [ { stat: true },
    [ 'a/symlink', 'a/symlink/a', 'a/symlink/a/b' ] ],

  [ { follow: true },
    [ 'a/symlink', 'a/symlink/a', 'a/symlink/a/b' ] ],

  [ { nounique: true },
    [ 'a/symlink',
      'a/symlink',
      'a/symlink',
      'a/symlink/a',
      'a/symlink/a',
      'a/symlink/a/b',
      'a/symlink/a/b' ] ],

  [ { nounique: true, mark: true },
    [ 'a/symlink/',
      'a/symlink/',
      'a/symlink/',
      'a/symlink/a/',
      'a/symlink/a/',
      'a/symlink/a/b/',
      'a/symlink/a/b/' ] ],

  [ { nounique: true, mark: true, follow: true },
    [ 'a/symlink/',
      'a/symlink/',
      'a/symlink/',
      'a/symlink/a/',
      'a/symlink/a/',
      'a/symlink/a/',
      'a/symlink/a/b/',
      'a/symlink/a/b/' ] ],
]

cases.forEach(function (c) {
  var opt = c[0]
  var expect = c[1].map(function (d) {
    return __dirname.replace(/\\/g, '/') + '/' + d
  })

  opt.realpath = true

  test(JSON.stringify(opt), function (t) {
    opt.realpath = true
    var sync = glob.sync(pattern, opt)
    t.same(sync, expect, 'sync')
    glob(pattern, opt, function (er, async) {
      if (er)
        throw er
      t.same(async, expect, 'async')
      t.end()
    })
  })
})