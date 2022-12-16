/**
 * A rehype plugin to replace template strings based on lodash.template.
 *
 * @since 0.0.0
 * @package rehype-lodash-template
 * @author Viktor Yakubiv (www.yakubiv.com)
 * @copyright Viktor Yakubiv & Contributors
 * @license MIT
 */

import makeTemplate from "lodash.template";
import { visitParents } from "unist-util-visit-parents";

/**
 * A rehype plugin to replace template strings based on lodash.template.
 *
 * @since 0.0.0
 * @author Viktor Yakubiv (www.yakubiv.com)
 *
 * @param {object} param0 { values, templateSettings }
 * @returns Rehype Plugin
 */
export default function attach({ values, templateSettings }) {
  const valueCache = new Map();

  const getTemplate = (identifier) => {
    if (!valueCache.has(identifier)) {
      valueCache.set(identifier, makeTemplate(identifier, templateSettings));
    }

    return valueCache.get(identifier);
  };

  const substitute = (identifier) => {
    const template = getTemplate(identifier);
    const substitutedString = template(values);

    // When the template matches one value completely, it's better to return
    // original value so the compiler can process it in own way.
    // This is helpful for boolean attributes like `hidden`
    // and useful for nullish values to remove the attribute or text completely.
    const valueEntry = Object.entries(values).find(
      ([name, value]) =>
        identifier.indexOf(name) >= 0 && substitutedString === String(value)
    );

    return valueEntry?.[1] ?? substitutedString;
  };

  const nodeVisitor = (node, ancestors) => {
    if (node.properties != null) {
      const processedPropEntries = Object.entries(node.properties).map(
        ([name, value]) =>
          Array.isArray(value)
            ? [name, substitute(value.join(" ")).split(/\s+/)]
            : [name, substitute(value)]
      );

      node.properties = Object.fromEntries(processedPropEntries);
    }

    if (node.value != null) {
      node.value = substitute(node.value) ?? "";

      if (node.value == null || node.value === "") {
        const [parent] = ancestors.slice(-1);
        const index = parent.children.indexOf(node);
        parent.children.splice(index, 1);
      } else if (typeof node.value != "string") {
        node.value = String(node.value);
      }
    }
  };

  return (tree) => visitParents(tree, nodeVisitor);
}
