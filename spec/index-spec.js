
var proxyquire = require('proxyquire');
var fs = MockFs();
var extract = proxyquire('../index', {
  'fs': fs
});
var simpleStyle = 'Prefix:<style>.hello {background: red}</style>-Suffix';
var simpleContent = '.hello {background: red}';

describe('stylextract-loader', function () {
  beforeEach(function() {
    fs.clear();
  });

  it('Returns the file without the style', function () {
    var pack = MockWebpack({resourcePath: 'hello.jsx'});
    var result = pack.extract(simpleStyle);
    expect(result).toBe('Prefix:require("../../../../../dist/csstemp/hello.jsx.scss")-Suffix');
  });

  it('Is cacheable', function () {
    var pack = MockWebpack();
    pack.extract(simpleStyle);
    expect(pack.cacheable).toHaveBeenCalled();
  });

  it('Uses the query string to determine temp dir', function () {
    var pack = MockWebpack({
      query: '?tempdir=/baz/bar',
      resourcePath: 'js/hello-world.jsx'
    });
    pack.extract(simpleStyle);
    expect(fs.state.dir).toBe('/dist/baz/bar');
    expect(fs.state.filePath).toBe('/dist/baz/bar/js-hello-world.jsx.scss');
  });

  it('Defaults temp folder to ./csstemp', function () {
    var pack = MockWebpack({
      query: '',
      resourcePath: 'a/b/c.jsx',
      outputPath: '/out'
    });
    pack.extract(simpleStyle);
    expect(fs.state.filePath).toBe('/out/csstemp/a-b-c.jsx.scss');
  });
})

function MockWebpack (opts) {
  opts = opts || {};

  var mock = {
    query: opts.query || '',
    resourcePath: opts.resourcePath || 'scripts/test-file.jsx',
    options:{
      output: {
        path: opts.outputPath || '/dist'
      },
    },
    cacheable: function () { },
    emitFile: function (fileName, content) { },
    extract: extract
  }

  spyOn(mock, 'emitFile');
  spyOn(mock, 'cacheable');

  return mock;
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
      // Simulate a directory not found scenario
      if (!this.state.writeCount) {
        this.state.writeCount = 1;
        throw 'DIRECTORY NOT FOUND';
      }

      this.state.filePath = filePath;
      this.state.fileContent = fileContent;
    }
  }
}
