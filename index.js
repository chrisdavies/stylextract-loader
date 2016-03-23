// Extract the first <style></style> element from the file being processed
// and add it as an externally required CSS file.
// How to keep the extracted CSS in memory rather than disk?

var querystring = require('querystring');
var path = require('path');
var crypto = require('crypto');

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

  return querystring.parse(query).tempdir;
}

// Extract the <style></style> content from the specified source
// and return the source with a require statement instead
function extractCSS(source, tempDir, context) {
  var parts = source.split('<style>', 2);

  if (parts.length == 2) {
    var end = parts[1].split('</style>', 2);
    var fileName = cssFileName(context);

    context.emitFile(path.join(tempDir, fileName), end[0]);

    return parts[0] + 'require("' + fileName + '")' + end[1];
  }

  return source;
}

// Generate the name of the CSS file being processed
function cssFileName(context) {
  var fileName = path.relative(__dirname, context.resourcePath) + '.scss';

  return fileName.split('/').join('-');
}
