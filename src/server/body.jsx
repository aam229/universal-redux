import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';

const Body = ({ assets, component, store, ssr }) => {
  const content = component ? ReactDOM.renderToString(component) : '';
  return (
    <body style={{ margin: 0 }}>
      { ssr ?
        <div id="content" dangerouslySetInnerHTML={{ __html: content }} /> :
        <div id="content" data-client-only dangerouslySetInnerHTML={{ __html: content }} />
      }
      <script dangerouslySetInnerHTML={{ __html: `window.ReduxStoreData=${serialize(store.getState())};` }} charSet="UTF-8" />
      { Object.keys(assets.javascript).map(jsAsset =>
        <script src={assets.javascript[jsAsset]} key={jsAsset} charSet="UTF-8" />
      )}
    </body>
  );
};

Body.propTypes = {
  store: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  assets: PropTypes.shape({
    javascript: PropTypes.array.isRequired
  }).isRequired,
  component: PropTypes.node.isRequired,
  ssr: PropTypes.bool.isRequired
};

export default Body;
