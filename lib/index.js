import limitPlugin from './limit';
import once from './once-per-query';

const plugins = {
  limit_collection: limitPlugin,
  once_per_query: once,
};

export { plugins };
export default { plugins };
