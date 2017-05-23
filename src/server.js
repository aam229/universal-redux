import path from 'path';
import config from 'universal-redux-config';
import { hooks, execute } from './hooks';
import createRenderer from './server/renderer';
import FileWatcher from './config/ConfigWatcher';


new FileWatcher(
    path.resolve(config.server.staticPath),
    path.join(config.server.webpackassets, 'client-dll-assets.json'),
    path.join(config.server.webpackassets, 'client-assets.json')
  )
  .load()
  .then(assets => execute(hooks.CREATE_SERVER, { config: config.server, renderer: createRenderer(config, assets) }))
  .then(({ server }) => execute(hooks.START_SERVER, { config: config.server, server }))
  .catch(err => console.error('Error booting the server: ', err.stack));
