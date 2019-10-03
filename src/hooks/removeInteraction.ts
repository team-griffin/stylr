import { mapProps } from '@team-griffin/rehook';
import * as r from 'ramda';

const removeInteraction = mapProps(r.omit([
  'active',
  'hover',
  'focus',
  'hocus',
]));

export default removeInteraction;