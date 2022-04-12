import assert from 'assert'
import { rehype } from 'rehype'
import template from './index.js'

describe('rehype-template', () => {
  const values = {
    id: 'chapter-1',
    title: 'Chapter 1',
    className: 'box   with primary surface',
    true: true,
    false: false,
    nullish: null,
    undefined: undefined,
  }

  const process = (file, options = {}) => rehype()
    .data({ settings: { fragment: true } })
    .use(template, { values, ...options })
    .process(file)
    .then(result => result.value)

  it('substitutes string values', async () => {
    const source = `
      <h1 class="one  \${className}" title=\${title}>
        <%= title %>
      </h1>
    `
    const expected = `
      <h1 class="one box with primary surface" title="Chapter 1">
        Chapter 1
      </h1>
    `
    const received = await process(source)
    assert.equal(received, expected)
  })

  it('substitutes boolean values properly', async () => {
    const source = `
      <span hidden=\${true}><%= true %></span>
      <span hidden=\${false}><%- false %></span>
    `
    const expected = `
      <span hidden>true</span>
      <span>false</span>
    `
    const received = await process(source)
    assert.equal(received, expected)
  })

  it('removes text node when itʼs nullish or empty', async () => {
    const source = `
      <span><%= null %></span>
      <span><%- undefined %></span>
    `
    const expected = `
      <span></span>
      <span></span>
    `
    const received = await process(source)
    assert.equal(received, expected)
  })

  it.skip('supports lodash.templateʼs script evaluation', () => {
    // Tricky to implement, can be done upon a request or via a PR.
    // Personally, I don't need this feature so far.
  })
})
