import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory as history, Router } from 'react-router';

import createStore from './shared/create';

// dependencies of external source. these resolve via webpack aliases
// as assigned in merge-configs.js
import getRoutes from 'routes';
import middleware from 'middleware';
import { hooks, execute } from './hooks';

const dest = document.getElementById('content');

const store = createStore(middleware, history, window.__data);
const routes = getRoutes(store);

function generateRootComponent({ clientComponents, includeClientComponents, render }) {
  const component = (
    <Router history={history} render={render}>
      {routes}
    </Router>
  );
  const root = (
    <Provider store={store} key="provider">
      <div>
        {component}
        { includeClientComponents ? clientComponents : null}
      </div>
    </Provider>
  );
  return Promise.resolve({ root, clientComponents });
}

// There is probably no need to be asynchronous here
execute(hooks.CREATE_ROOT_COMPONENT, { store, routes, history, clientComponents: [], includeClientComponents: false }, generateRootComponent)
  .then(({ root, clientComponents }) => {
    ReactDOM.render(root, dest);

    if (process.env.NODE_ENV !== 'production') {
      window.React = React; // enable debugger
      if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
        console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
      }
    }
    if (clientComponents.length === 0) {
      return;
    }
    // Rerender the root component with the dev component (redux sidebar)
    return execute(hooks.CREATE_ROOT_COMPONENT, {store, routes, history, clientComponents: [], includeClientComponents: true}, generateRootComponent)
      .then(({ root }) => {
        ReactDOM.render(root, dest);
      });
  })
  .catch((err) => {
    console.error(err, err.stack);
  });

