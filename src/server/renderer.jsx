import React from 'react';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';

import { match } from 'react-router';
import PrettyError from 'pretty-error';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';

import getRoutes from 'routes';
import middleware from 'middleware';

import createStore from '../shared/create';
import html from './html';
import { hooks, execute } from '../shared/hooks';

const pretty = new PrettyError();

function createRootComponent({ store, renderProps, additionalComponents }) {
  const root = (
    <Provider store={store} key="provider">
      <div>
        <RouterContext {...renderProps} />
        {additionalComponents}
      </div>
    </Provider>
  );

  return Promise.resolve({ root });
}

function renderRootComponent({ config, assets, store, headers, root }) {
  return {
    status: 200,
    body: html(config, assets, store, headers, root)
  };
}

function renderer({ history, routes, store, assets, location, headers, cookies, config }) {
  if (config.server && config.server.disabled === true) {
    return Promise.resolve(renderRootComponent({ config, assets, store, headers }));
  }
  return new Promise((resolve, reject) => {
    match({ history, routes, location }, (error, redirectLocation, renderProps) => {
      if (error) {
        reject(error);
      } else if (redirectLocation) {
        resolve({ redirect: redirectLocation.pathname + redirectLocation.search });
      } else if (!renderProps) {
        reject({ status: 400 });
      } else {
        execute(hooks.CREATE_ROOT_COMPONENT, { config, assets, store, headers, cookies, renderProps, additionalComponents: [] }, createRootComponent)
          .then(({ root }) => execute(hooks.RENDER_ROOT_COMPONENT, { config, assets, store, headers, cookies, root }, renderRootComponent))
          .then(resolve, reject);
      }
    });
  })
  .catch((err) => {
    const error = pretty.render(err);
    console.error(error);
    return {
      error: pretty.render(error),
      status: 500
    };
  });
}

export default (config, assets) => ({ location, headers, cookies }) => {
  const { store, history } = createStore(middleware, createMemoryHistory([ location ]), {}, cookies, headers);

  const routes = getRoutes(store);
  return renderer({ history, routes, store, assets, location, headers, cookies, config });
};
