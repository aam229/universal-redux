import React from 'react';
import ReactDOM from 'react-dom/server';
import Head from './head';
import Body from './body';

export default (config, assets, store, headers, component) => `<!doctype html>\n${ReactDOM.renderToString(
  <html lang="en-US">
    <Head assets={assets} store={store} headers={headers} />
    <Body assets={assets} store={store} headers={headers} component={component} ssr={config.server.rendering} />
  </html>
  )}`;
