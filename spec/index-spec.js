var proxyquire =  require('proxyquire');
var fs = MockFs();
var rimraf = MockRimraf();
var extract = proxyquire('../index', {
  'fs': fs,
  'rimraf': rimraf
});

var simpleStyle = '<style>.hello {background: red }</style>';

describe('stylextract-loader', function () {
  beforeEach(function() {
    fs.clear();
    rimraf.clear();
  });

  it('Uses the query string to determine temp dir', function () {
    var pack = MockWebpack({query: '?tempdir=/baz/bar'});
    pack.extract(simpleStyle);
    expect(rimraf.state.dir).toBe('/baz/bar');
    expect(fs.state.dir).toBe('/baz/bar');
  });

  it('Defaults temp folder to ./csstemp', function () {
    var pack = MockWebpack({query: ''});
    pack.extract(simpleStyle);
    expect(rimraf.state.dir).toBe('./csstemp');
    expect(fs.state.dir).toBe('./csstemp');
  });
})

function MockWebpack (opts) {
  return {
    query: opts.query || '',
    resourcePath: opts.resourcePath || 'scripts/test-file.jsx',
    cacheable: function () { },
    extract: extract
  }
}

function MockFs() {
  return {
    state: {},

    clear: function () {
      this.state = {};
    },

    mkdirSync: function (dir) {
      this.state.dir = dir;
    },

    writeFileSync: function (filePath, fileContent) {
      this.state.filePath = filePath;
      this.state.fileContent = fileContent;
    }
  }
}

function MockRimraf () {
  return {
    state: {},

    clear: function () {
      this.state = {};
    },

    sync: function (dir) {
      this.state.dir = dir;
    }
  }
}
