import React from 'react';
import { Table, Icon, Label } from 'semantic-ui-react';
import { formatDate } from '../../utils/date';

class LeaguesTableRowClosed extends React.Component {
  render() {
    const { data } = this.props;
    const dateCreated = formatDate(data.date.created);
    const dateStarted = formatDate(data.date.started);
    const dateClosed = formatDate(data.date.closed);
    return (
      <Table.Row>
        <Table.Cell>{data.name}</Table.Cell>
        <Table.Cell>{data.description}</Table.Cell>
        <Table.Cell>{data.owner}</Table.Cell>
        <Table.Cell>{dateCreated}</Table.Cell>
        <Table.Cell>{dateStarted}</Table.Cell>
        <Table.Cell>{dateClosed}</Table.Cell>
        <Table.Cell textAlign="left">
          <Label as="a" color="blue" ribbon="right">
            <Icon name="hand pointer" size="large" />
            Akcja
          </Label>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default LeaguesTableRowClosed;
