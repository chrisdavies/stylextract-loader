// Extract the first <style></style> element from the file being processed
// and add it as an externally required CSS file.
// TODO: keep the extracted CSS in memory rather than disk

var querystring = require('querystring');
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');

module.exports = function(source) {
  this.cacheable();

  // Get the name of the temp directory where we'll dump generated CSS files
  var tempDir = getDirectoryName(this);

  // Extract and generate the CSS file
  return extractCSS(source, tempDir, this);
};

// Extract the name of the temp css directory
// Right now, our query is either: '' or '?tempdir=path'
function getDirectoryName(context) {
  var query = context.query.slice(1) || 'tempdir=./csstemp'

  return path.join(
    context.options.output.path,
    querystring.parse(query).tempdir
  )
}

// Extract the <style></style> content from the specified source
// and return the source with a require statement instead
function extractCSS(source, tempDir, context) {
  var parts = source.split('<style>', 2);

  if (parts.length == 2) {
    var end = parts[1].split('</style>', 2);
    var fileName = cssFileName(context);
    var filePath = path.join(tempDir, fileName);

    function writeFile() {
      fs.writeFileSync(filePath, end[0]);
    }

    try {
      writeFile();
    } catch (ex) {
      fs.mkdirSync(tempDir);
      writeFile();
    }

    var requirePath = path.relative(path.dirname(context.resourcePath), filePath);

    return parts[0] + 'require("' + requirePath + '")' + end[1];
  }

  return source;
}

// Generate the name of the CSS file being processed
function cssFileName(context) {
  var fileName = path.relative(__dirname, context.resourcePath) + '.scss';

  return fileName.split('/').join('-');
}
