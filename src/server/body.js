import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';

export default class Body extends Component {
  static propTypes = {
    additions: PropTypes.string,
    assets: PropTypes.object,
    component: PropTypes.node,
    headers: PropTypes.object,
    store: PropTypes.object,
    clientOnly: PropTypes.bool
  };

  render() {
    const { assets, component, store } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';

    return (
      <body style={{margin: 0}}>
        { this.props.clientOnly  ?
          <div id="content" data-client-only dangerouslySetInnerHTML={{ __html: content }}/> :
          <div id="content" dangerouslySetInnerHTML={{ __html: content }}/>
        }
        <script dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }} charSet="UTF-8"/>
        { Object.keys(assets.javascript).map((jsAsset, key) =>
          <script src={assets.javascript[jsAsset]} key={key} charSet="UTF-8"/>
        )}
      </body>
    );
  }
}
