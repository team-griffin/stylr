export interface Indexer<T = any>{
  [key: string]: T,
}

export type Style = string | number;
export type StylesVar = { [key: string]: Style };
export type StylesNamespace = { [namespace: string]: StylesVar };
export type StylesModule = { default: StylesNamespace };
export type StylesPromise = Promise<StylesNamespace | StylesModule>;
export type StylesFn = () => StylesPromise;
export type Styles = StylesNamespace | StylesFn;
export interface Stylesheet {
  default?: Styles,
  [modifier: string]: Styles,
}
