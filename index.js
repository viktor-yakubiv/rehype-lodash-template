import makeTemplate from 'lodash.template'
import { visitParents as visit } from 'unist-util-visit-parents'

const attach = (options = {}) => {
  const {
    values = {},
    templateSettings,
  } = options

  const cache = new Map()

  const template = str => {
    if (!cache.has(str)) {
      cache.set(str, makeTemplate(str, templateSettings))
    }

    return cache.get(str)
  }

  const substitute = str => {
    const newString = template(str)(values)

    // When the template matches one value completely, it's better to return
    // original value so the compiler can process it in own way.
    // This is helpful for boolean attributes like `hidden`
    // and useful for nulish values to remove the attribute or text completely.
    const valueEntry = Object.entries(values).find(([name, value]) =>
      str.indexOf(name) >= 0 && newString === String(value))

    return valueEntry?.[1] ?? newString
  }

  const visitor = (node, ancestors) => {
    if (node.properties != null) {
      const processedPropEntries = Object.entries(node.properties)
        .map(([name, value]) =>
          Array.isArray(value)
            ? [name, substitute(value.join(' ')).split(/\s+/)]
            : [name, substitute(value)])

      node.properties = Object.fromEntries(processedPropEntries)
    }

    if (node.value != null) {
      node.value = substitute(node.value) ?? ''

      if (node.value == null || node.value === '') {
        const [parent] = ancestors.slice(-1)
        const index = parent.children.indexOf(node)
        parent.children.splice(index, 1)
      } else if (typeof node.value != 'string') {
        node.value = String(node.value)
      }
    }
  }

  const transform = tree => {
    visit(tree, visitor)
  }

  return transform
}

export default attach
