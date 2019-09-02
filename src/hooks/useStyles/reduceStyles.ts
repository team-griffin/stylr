import {
  isPromise,
  mergeDeep,
} from '../../utils';
import autoPrefix from './autoPrefix';
import { StylesNamespace } from '../../types';

const isAsyncStyle = isPromise;

/*
simply just reduces an array of styles by merging them together
([
  {
    root: {
      color: 'black',
    },
  },
  {
    root: {
      color: 'blue',
    },
  },
]) => {
  root: {
    color: 'blue',
  },
}
*/
const reduceStyles = (modifiers: StylesNamespace[]) => {
  const reduced = modifiers.reduce(mergeDeep, {});
  return autoPrefix(reduced);
};

// calls reduceStyles but only for styles that aren't promises
export const reduceSyncStyles = (styles: (StylesNamespace | Promise<StylesNamespace>)[]) => {
  const syncStyles = styles.filter((styles) => {
    return !isAsyncStyle(styles);
  }) as StylesNamespace[];
  return reduceStyles(syncStyles);
};

// checks if any styles are promises
export const hasAsyncStyles = (styles: (StylesNamespace | Promise<StylesNamespace>)[]) => {
  return styles.some(isAsyncStyle);
};

export default reduceStyles;
