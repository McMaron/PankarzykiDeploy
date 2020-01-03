import React from 'react';
import { Dimmer, Loader as SemanticLoader } from 'semantic-ui-react';

const Loader = ({ text = '' }) => {
  return (
    <Dimmer active>
      <SemanticLoader content={text} />
    </Dimmer>
  );
};

export default Loader;
