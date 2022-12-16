import type { TemplateOptions } from 'lodash'
import type { Root } from 'hast'
import type { Plugin } from 'unified'

interface Options {
  values?: object,
  templateSettings?: TemplateOptions,
}

declare const rehypeLodashTemplate: Plugin<[Options?] | Array<void>, Root>

export default rehypeLodashTemplate
export type { Options }
