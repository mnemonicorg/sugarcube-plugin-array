import {size, slice, set} from 'lodash/fp';

const plugin = (envelope, {log, cfg}) => {
  const limit = cfg.collection.limit;

  log.info(`Limiting ${size(envelope.data)} units to ${limit}.`);

  return set('data', slice(0, limit)(envelope.data))(envelope);
};

plugin.desc = 'Limit the amount of results';

plugin.argv = {
  'collection.limit': {
    default: 10,
    nargs: 1,
    desc: 'Limit collection to how many results',
  },
};

export default plugin;
