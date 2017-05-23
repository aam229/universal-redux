import React from 'react';
import PropTypes from 'prop-types';
import DocumentMeta from 'react-document-meta';

const Head = ({ assets }) => (
  <head>
    {DocumentMeta.renderAsReact()}
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {Object.keys(assets.styles).map(style =>
      (<link
        href={assets.styles[style]}
        key={style}
        media="screen, projection"
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
      />)
    )}
  </head>
);

Head.propTypes = {
  assets: PropTypes.shape({
    javascript: PropTypes.array.isRequired
  }).isRequired,
};

export default Head;
