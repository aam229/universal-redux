import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router, match } from 'react-router';

import createStore from './shared/create';

// dependencies of external source. these resolve via webpack aliases
// as assigned in merge-configs.js
import getRoutes from 'routes';
import middleware from 'middleware';
import { hooks, execute } from './hooks';

const dest = document.getElementById('content');
const clientOnly = !!dest.attributes['data-client-only'];

const { store, history } = createStore(middleware, browserHistory, window.__data);
const routes = getRoutes(store);

function generateRootComponent({ clientComponents, includeClientComponents, render, renderProps }) {
  const root = (
    <Provider store={store} key="provider">
      <div>
        <Router {...renderProps} history={history} render={render} />
        { includeClientComponents ? clientComponents : null}
      </div>
    </Provider>
  );
  return Promise.resolve({ root, clientComponents, renderProps });
}

// There is probably no need to be asynchronous here
new Promise((resolve, reject) => {
    const location = window.location.pathname + window.location.search + window.location.hash;
    match({ routes, store, history, location }, (error, redirectLocation, renderProps) => {
      if(error) reject(error);
      else if(redirectLocation) window.location.href = redirectLocation.pathname + redirectLocation.search + redirectLocation.hash;
      else resolve({ renderProps });
    })
  })
  .then(({renderProps}) => execute(hooks.CREATE_ROOT_COMPONENT, { store, routes, history, renderProps, clientOnly, clientComponents: [], includeClientComponents: false}, generateRootComponent))
  .then(({ root, clientComponents, renderProps }) => {
    ReactDOM.render(root, dest);

    if (process.env.NODE_ENV !== 'production' && !clientOnly) {
      window.React = React; // enable debugger
      if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
        console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
      }
    }

    if (clientComponents.length === 0) {
      return;
    }
    // Rerender the root component with the dev component (redux sidebar)
    return execute(hooks.CREATE_ROOT_COMPONENT, {store, routes, history, renderProps, clientOnly, clientComponents: [], includeClientComponents: true}, generateRootComponent)
      .then(({ root }) => {
        ReactDOM.render(root, dest);
      });
  })
  .catch((err) => {
    console.error(err, err.stack);
  });

