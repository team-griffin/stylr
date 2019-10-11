import { supportedProperty, supportedValue } from 'css-vendor';
import { StylesVar, StylesNamespace } from '../../types';
import { mapObj, reduceObj } from '../../utils';

const autoPrefix = (namepsacedStyles: StylesNamespace) => {
  return mapObj((styles) => {
    const initial = {} as StylesVar;
    return reduceObj((acc, _value, _key) => {
      // opt out of grid prefixing, causes too many IE11 issues
      // modern browsers support the standard syntax
      if (_key === 'display' && _value === 'grid') {
        return {
          ...acc,
          [_key]: _value,
        };
      }

      const key = supportedProperty(_key);
      const value = supportedValue(key, _value);
      return {
        ...acc,
        [key]: value,
      };
    }, initial, styles);
  }, namepsacedStyles);
};

export default autoPrefix;
