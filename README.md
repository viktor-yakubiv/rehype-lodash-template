# rehype-lodash-template

**[rehype][]** plugin to replace template strings
with values from a dictionary.
It is based on the [lodash.template][] function

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(rehypeLodashTemplate[, options])`](#unifieduserehypelodashtemplate-options)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [License](#license)

## What is this?

This package is a [unified][] ([rehype][]) plugin
to replace template strings with a values
from a provided dictionary.
It looks through all strings
in the document (attribute values and text nodes)
and replaces template strings according to the replacement map.
It is based on the [lodash.template][]
where you can find more about how it works internally.

**unified** is a project that transforms content
with abstract syntax trees (ASTs).
**rehype** adds support for HTML to unified.
**hast** is the HTML AST that rehype uses.
This is a rehype plugin
that replaces template strings to values
from the passed dictionary.

## When should I use this?

This plugin is useful to create small templates from HTML code.

It works on the abstract syntax tree level rather on the text level
and can potentially perform smarter replacements in the future
but is also [limited][limitation-test] by that.

## Install

This package is [ESM only][esm-only].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install rehype-lodash-template
```

In Deno with [`esm.sh`][esmsh]:

```js
import rehypeLodashTemplate from 'https://esm.sh/rehype-lodash-template@0.1'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import rehypeLodashTemplate from 'https://esm.sh/rehype-lodash-template@0.1?bundle'
</script>
```

## Use

Say we have the following file `example.html`:

```html
<h1 id=${id} title="${title}">
  ${ index }. <%= caption %>
</h1>
```

And our module `example.js` looks as follows:

```js
import { read } from 'to-vfile'
import { rehype } from 'rehype'
import rehypeLodashTemplate from 'rehype-lodash-template'

const file = await rehype()
  .data('settings', { fragment: true })
  .use(rehypeLodashTemplate, {
    values: {
      id: 'chapter-1',
      title: 'First chapter',
      index: 1,
      caption: 'Chapter 1',
    },
  })
  .process(await read('example.html'))

console.log(String(file))
}
```

Now, running `node example.js` yields:

```html
<h1 id="chapter-1" title="First chapter">
  1. Chapter 1
</h1>
```

## API

This package exports no identifiers.
The default export is `rehypeTemplate`.

### `unified().use(rehypeLodashTemplate[, options])`

Replaces template strings with values from a dictionary.

##### `options`

Configuration (optional).
Although, if you don't pass the `values` option with a replacement map,
the plugin won't function.

###### `options.values`

A dictionary to with replacement values.
It is passed unchanged to template functions
compiled by the [lodash.template][].
It will support nested structures as Lodash does out of the box.

Default is `{}` (an empty object).

###### `options.templateSettings`

Options passed directly to the [lodash.template][].
See the structure and details in Lodash documentation.
This object is not processed by the plugin
but passed directly.

Default is `undefined`.

## Types

This package is typed with [TypeScript][].
It exports `Options` type,
which specifies the interface of the accepted options.

## Compatibility

Compatibility tested with Node.js v12.20 – v19.4

## Security

Use of `rehype-lodash-template` can open you up to a
[cross-site scripting (XSS)][xss] attack if you pass user provided content in
`properties` or `content`
without proper escaping it by a mechanism
provided by the [lodash.template][] function.

## License

[MIT](./LICENSE) © [Viktor Yakubiv](https://yakubiv.com)


<!-- Definitions -->

[npm]: https://docs.npmjs.com/cli/install

[esmsh]: https://esm.sh

[esm-only]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[typescript]: https://www.typescriptlang.org

[unified]: https://github.com/unifiedjs/unified

[rehype]: https://github.com/rehypejs/rehype

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[limitation-test]: ./test.js#L63

[lodash.template]: https://www.npmjs.com/package/lodash.template
