import {size} from 'lodash/fp';
import Promise from 'bluebird';
import fs from 'fs';
import {envelope as env, plugins as p, utils} from 'littlefork';

Promise.promisifyAll(fs);

const plugin = (envelope, {log, cfg}) => {
  const filename = cfg.json.filename;
  const data = cfg.json.prettify ?
               JSON.stringify(envelope.data, null, '  ') :
               JSON.stringify(envelope.data);

  log.info(`Writing ${size(envelope.data)} units to ${filename}.`);

  return fs.writeFileAsync(filename, data)
           .return(envelope);
};

plugin.desc = 'Export data units to a file as JSON.';

plugin.argv = {
  'json.filename': {
    default: 'out.json',
    nargs: 1,
    desc: 'The file name to write the CSV to.',
  },
};

export default plugin;
