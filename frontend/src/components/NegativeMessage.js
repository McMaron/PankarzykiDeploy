import React from 'react';
import { Message } from 'semantic-ui-react';

const NegativeMessage = props => (
  <Message negative>
    <Message.Header>{props.header}</Message.Header>
    <p>{props.paragraph}</p>
  </Message>
);

NegativeMessage.defaultProps = {
  header: 'Błąd!',
  paragraph: 'Spróbuj ponownie',
};

export default NegativeMessage;
