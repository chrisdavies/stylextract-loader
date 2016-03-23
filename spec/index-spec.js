
var extract = require('../index');
var simpleStyle = 'Prefix:<style>.hello {background: red}</style>-Suffix';
var simpleContent = '.hello {background: red}';

describe('stylextract-loader', function () {
  it('Returns the file without the style', function () {
    var pack = MockWebpack({resourcePath: 'hello.jsx'});
    var result = pack.extract(simpleStyle);
    expect(result).toBe('Prefix:require("hello.jsx.scss")-Suffix');
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
    expect(pack.emitFile)
      .toHaveBeenCalledWith('/baz/bar/js-hello-world.jsx.scss', simpleContent);
  });

  it('Defaults temp folder to ./csstemp', function () {
    var pack = MockWebpack({
      query: '',
      resourcePath: 'a/b/c.jsx'
    });
    pack.extract(simpleStyle);
    expect(pack.emitFile)
      .toHaveBeenCalledWith('csstemp/a-b-c.jsx.scss', simpleContent);
  });
})

function MockWebpack (opts) {
  opts = opts || {};

  var mock = {
    query: opts.query || '',
    resourcePath: opts.resourcePath || 'scripts/test-file.jsx',
    cacheable: function () { },
    emitFile: function (fileName, content) { },
    extract: extract
  }

  spyOn(mock, 'emitFile');
  spyOn(mock, 'cacheable');

  return mock;
}
