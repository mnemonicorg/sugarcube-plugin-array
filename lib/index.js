import {forEach, merge, values} from 'lodash/fp';

import exportPlugin from './export';

const plugins = {
  json_export: exportPlugin,
};

forEach(p => {
  p.argv = merge({  // eslint-disable-line no-param-reassign
    'json.prettify': {
      default: false,
      type: 'boolean',
      desc: 'Prettify the JSON output.'
    }
  }, p.argv);
}, values(plugins));

export { plugins };
export default { plugins };
