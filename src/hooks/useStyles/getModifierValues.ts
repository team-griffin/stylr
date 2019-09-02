import { Indexer } from '../../types';
import { reduceObj } from '../../utils';

/*
this function just flattens and returns all of the modifier values
we then use this as the dep array when calling our react hooks for caching
this means that if you're using any of your props in your styles, you should also pass them
in as modifiers
([ { foo: 'bah' }, { age: 45 }]) => [ 'bah', 45 ]
*/
const getModifierValues = <T extends Indexer>(modifiers: T[]) => {
  return modifiers.reduce((acc, modifiers) => {
    return reduceObj((acc, value) => acc.concat(value), acc, modifiers);
  }, []);
};

export default getModifierValues;
