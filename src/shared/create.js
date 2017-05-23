import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore as reduxCreateStore, combineReducers } from 'redux';

import { hooks, execute } from '../hooks';

function createMiddlewareHook({ middleware }) {
  return applyMiddleware(...middleware);
}

function createReducerHook({ reducers }) {
  return combineReducers(reducers);
}

function createStoreHook({ createStore, reducer, data }) {
  return createStore(reducer, data);
}

export default function create(staticMiddleware, history, data, cookies, headers) {
  const middleware = [ ...staticMiddleware, routerMiddleware(history) ];
  const reducers = { routing: routerReducer };

  const store = execute(hooks.CREATE_REDUX_STORE, {
    reducer: execute(hooks.CREATE_REDUX_REDUCER, { reducers }, createReducerHook),
    createStore: execute(hooks.CREATE_REDUX_MIDDLEWARE, { middleware }, createMiddlewareHook)(reduxCreateStore),
    data,
    cookies,
    headers
  }, createStoreHook);
  return { store, history: syncHistoryWithStore(history, store) };
}
