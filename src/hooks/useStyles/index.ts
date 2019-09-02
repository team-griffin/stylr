import {
  useEffect,
  useState,
  useMemo,
} from 'react';
import {
  Indexer,
  Stylesheet,
} from '../../types';
import getStyles from './getStyles';
import reduceStyles, {
  hasAsyncStyles,
  reduceSyncStyles,
} from './reduceStyles';
import normalizeModifiers from './normalizeModifiers';
import getModifierValues from './getModifierValues';

const useStyles = <T extends Indexer>(
  stylesheet: Stylesheet,
  _modifiers?: T | T[],
) => {
  const modifiers = normalizeModifiers<T>(_modifiers);
  const deps = getModifierValues(modifiers);
  // get all applicable styles, we use the given modifiers to determine when to re-calculate this
  // this can contain both sync and async styles
  const allStyles = useMemo(() => getStyles(stylesheet, modifiers), deps);
  // calculate the initial styles to use, we should only ever do this once
  const initialStyles = useMemo(() => reduceSyncStyles(allStyles), []);
  const [ styles, setStyles ] = useState(initialStyles);

  // whenever allStyles is recalculated we want to update the state
  // and also process any aysnc styles
  useEffect(() => {
    let mounted = true;
    setStyles(reduceSyncStyles(allStyles));

    if (hasAsyncStyles(allStyles)) {
      // resolve all async styles and then update the state with the resolved value
      Promise.all(allStyles).then((x) => {
        if (mounted) {
          const result = reduceStyles(x);
          setStyles(result);
        }
      });
    }

    // if the promise resolves after the component has unmounted
    // we don't want to trigger the setState action
    return () => {
      mounted = false;
    };
  }, [ allStyles ]);

  return { styles };
};

export default useStyles;
