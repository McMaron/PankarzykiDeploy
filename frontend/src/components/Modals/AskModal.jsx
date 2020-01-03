import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
const AskModal = props => {
  const onPositive = () => {
    (props.onPositive || (() => {}))();
    props.onClose();
  };

  const onNegative = () => {
    (props.onNegative || (() => {}))();
    props.onClose();
  };

  return (
    <Modal open={props.open} onClose={props.onClose} closeOnDimmerClick={false} size="small">
      <Modal.Header>{props.header}</Modal.Header>
      {props.children ? <Modal.Content>{props.children}</Modal.Content> : ''}
      <Modal.Actions>
        <Button onClick={onPositive} positive labelPosition="right" icon="checkmark" content={props.positive} />
        <Button onClick={onNegative} negative labelPosition="right" icon="close" content={props.negative} />
      </Modal.Actions>
    </Modal>
  );
};

export default AskModal;
