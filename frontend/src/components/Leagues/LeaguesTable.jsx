import React from 'react';
import { Table } from 'semantic-ui-react';

class LeaguesTable extends React.Component {
  state = {
    leagues: [],
  };

  refresh = () => {
    this.props.query().then(leagues => this.setState({ leagues }));
  };

  componentDidMount = () => {
    this.refresh();
  };

  render() {
    return (
      <Table celled textAlign="center">
        <Table.Header>
          <Table.Row>
            {this.props.headers.map(x => (
              <Table.HeaderCell key={x.name} width={x.width}>
                {x.name}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.state.leagues.map(x => (
            <this.props.row key={x._id} data={x} refresh={this.refresh} />
          ))}
        </Table.Body>
      </Table>
    );
  }
}

export default LeaguesTable;
