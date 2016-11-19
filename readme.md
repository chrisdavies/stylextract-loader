# Stylextract

A simple WebPack loader that extracts a `<style></style>` element into its
own CSS file. Useful for putting component-specific CSS into your JSX files,
but still benefitting from writing SCSS, using autoprefixer, etc.

[![Build Status](https://travis-ci.org/chrisdavies/stylextract-loader.svg?branch=master)](https://travis-ci.org/chrisdavies/stylextract-loader)

## Installation

`npm install stylextract-loader`

## Usage without webpack CSS modules

In any JSX file, you are allowed one and *only one* `<style>` element. It can
go anywhere in the file you wish, but it's good to be consistent across your
files for readability purposes. I tend to put my style tags last in the file.

```jsx

import React from 'react'

export default function ({name}) {
  return (
    <h1 className="hello-header">{name}</h1>
  )
}

<style>
  .hello-header {
    background: steelblue;
    color: white;
  }
</style>

```

## Usage with webpack CSS modules

Stylextract pairs nicely with webpack's CSS modules. Just assign the style
tag to a const.

```jsx

import React from 'react'

export default function ({name}) {
  return (
    <h1 className={css.helloHeader}>{name}</h1>
  )
}

const css = <style>
  .helloHeader {
    background: steelblue;
    color: white;
  }
</style>

```

## Configuration

Here's a snippet from one project's `webpack.config.js` file. The key is that
stylextract must run *before* Babel, as the `<style>` tag is invalid JSX and
will break the build otherwise.

```js
config.module = {
  loaders: [{
    // JavaScript transpiling
    test: /.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel?' + JSON.stringify(babelSettings) + '!stylextract'
  }, {
    // SCSS support
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('css-loader?modules!sass')
  }],
};

```

### Changing the extraction directory

By default stylextract extracts your inline styles into a file in the `csstemp`
directory beneath your project's output directory. You can configure the name
of the css output directory using the `tempdir` option:

`stylextract?tempdir=./my-fanci-dir`

## Limitations

As mentioned above, stylextract allows only one `<style>` tag per JSX file.
It will simply extract the first and ignore subsequent occurrences. This
limitation has its upsides.

Every time I've wanted more than one style tag, it's been a sign of code-smell
in my component. The correct solution was to break my component down into
sub-components.

## License MIT

Copyright (c) 2015 Chris Davies

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
