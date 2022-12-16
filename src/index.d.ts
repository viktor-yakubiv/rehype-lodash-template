import { TemplateOptions } from "lodash";
interface AttachProps {
  values: object;
  templateSettings: TemplateOptions;
}
export default function attach({ values, templateSettings }: AttachProps): (tree: any) => void;
export {};
