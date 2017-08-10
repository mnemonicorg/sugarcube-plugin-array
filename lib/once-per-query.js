import {size, set} from 'lodash/fp';
import {runner} from 'littlefork-core';
import Promise from 'bluebird';

const plugin = (envelope, {log, cfg}) => {
  log.info('Splitting it up by query');
  const ss = size(envelope.queries);
  let ii = 1;

  const f = q => {
    const run = runner(cfg, [q]);
    log.info(`running for query ${q.type} ${q.term} (${ii}/${ss})`);
    ii += 1;
    // shamefully copied from littlefork-cli
    run.stream.onValue(msg => {
      switch (msg.type) {
        case 'log_info':
          log.info(`    ${msg.msg}`); break;
        case 'log_error':
          log.error(`    ${msg.msg}`); break;
        case 'log_debug':
          log.debug(`    ${msg.msg}`);
          break;
        case 'plugin_start':
          log.info(`    Starting the ${msg.plugin} plugin.`); break;
        case 'plugin_end':
          log.info(`    Finished the ${msg.plugin} plugin.`); break;
        default: break;
      }
    });
    run.stream.onEnd(() => log.info('    Finished the LSD.'));

    log.info(`    Starting run ${run.marker}.`);
    return run();
  };

  if (size(envelope.queries) === 1) { return envelope; }

  return Promise.each(envelope.queries, f).then(() => {
    log.info('done by queries');
    return set('queries', [], envelope);
  });
};

plugin.desc = 'Run the pipeline once for each query.';

plugin.argv = {
  'collection.limit': {
    default: 10,
    nargs: 1,
    desc: 'Limit collection to how many results',
  },
};

export default plugin;
