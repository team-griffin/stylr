import { omitProps } from '@team-griffin/rehook';

const removeInteraction = omitProps([
  'active',
  'hover',
  'focus',
  'hocus',
]);

export default removeInteraction;
