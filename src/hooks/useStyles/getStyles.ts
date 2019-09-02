import {
  isPromise,
  reduceObj,
} from '../../utils';
import {
  Indexer,
  Styles,
  StylesNamespace,
  Stylesheet,
} from '../../types';

/*
given a stylesheet (an object containing modifiers -> styles), we want to return all of the
styles that match the current set of modifiers
(
  {
    default: {
      root: {
        color: 'black',
        backgroundColor: 'white',
      },
    },
    foo: {
      root: {
        color: 'blue',
      },
    },
  },
  [
    {
      foo: true,
    },
  ],
) => [
  {
    root: {
      color: 'black',
      backgroundColor: 'white',
    },
  },
  {
    root: {
      color: 'blue',
    },
  },
]
*/

// eslint-disable-next-line max-len
const appendStylesForKey = <T extends Indexer>(stylesheet: Stylesheet, props: T) => (acc: Styles[], value: any, key: string) => {
  if (value && stylesheet[key]) {
    return acc.concat(stylesheet[key]);
  }
  return acc;
};
// eslint-disable-next-line max-len
const appendStylesForProps = (stylesheet: Stylesheet) => <T extends Indexer>(acc: Styles[], props: T) => {
  return reduceObj(appendStylesForKey(stylesheet, props), acc, props);
};
const handleAsyncModifier = (modifier: Styles) => {
  if (typeof modifier !== 'function') {
    return modifier;
  }
  const styles = modifier();
  if (!isPromise(styles)) {
    return styles;
  }

  // @ts-ignore
  const p = styles
    .then((styles) => {
      return (styles.default || styles) as StylesNamespace;
    });

  return p;
};

const getStyles = <T extends Indexer>(
  stylesheet: Stylesheet,
  modifiers: T[],
) => {
  const initial = [ stylesheet.default || {} ];
  const styles = modifiers
    .reduce<Styles[]>(appendStylesForProps(stylesheet), initial)
    .map(handleAsyncModifier);
  return styles;
};

export default getStyles;
