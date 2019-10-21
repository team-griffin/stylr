import { Indexer } from '../../types';
import { reduceObj, isPrimitive } from '../../utils';

/*
takes the modifiers parameter and normalizes it
if omitted, it defaults to an empty array
if an object is supplied, it is wrapped in an array
for each modifier, the key/value are combined an added as a new key
({
  thing: true,
  foo: 'bah',
}) => [
  {
    thing: true,
    foo: 'bah',
    'thing.true': true,
    'foo.bah': true,
  },
]
*/

const normalizeModifiers = <T extends Indexer>(_modifiers: T | T[] | undefined | null): T[] => {
  const modifiers = [].concat(_modifiers || []) as T[];
  return modifiers.map((props) => {
    const initial = {} as T;
    return reduceObj((acc, value, key) => {
      if (!isPrimitive(value)) {
        return {
          ...acc,
          [key]: value,
        };
      }
      return {
        ...acc,
        [key]: value,
        [`${key}-${value}`]: true,
      };
    }, initial, props);
  });
};

export default normalizeModifiers;
