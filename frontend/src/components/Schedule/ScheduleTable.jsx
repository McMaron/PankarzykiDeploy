import React from 'react';
import axios from 'axios';
import { Table } from 'semantic-ui-react';
import TableRow from './TableRow'
import Store from '../../Store';

class ScheduleTable extends React.Component {
  static contextType = Store;

  state = {
    matches: [],
    league: ''
  }
  getData() {
    
    if (this.props.league !== '' & this.props.league !== this.state.league) {
      axios({
        url: `/api/matches/${this.props.league}/league`,
        method: 'get',
        headers: {'x-auth-token': localStorage.getItem('token'),},
      }).then(  result => {
        var myTeams = this.props.teams.map( team => team._id);
          let matches = result.data.map( match => {
            let myGame = false;
            if (myTeams.includes(match.teams.first._id) || myTeams.includes(match.teams.second._id)) {
              myGame = true;
            };
            match.myGame = myGame
            return match;
          })        
        this.setState({ matches: matches, league: this.props.league });
      }).catch()  
    } 
    else if (this.props.league === '') {
      this.setState({ matches: [], league: ''})
    }
  }

  componentDidMount() {
    this.getData()
  }
  
  componentDidUpdate() {
    this.getData()
  }
    

  render() {
    return (
      <>
      { this.state.league && (
      <Table celled textAlign="center">
        <Table.Header>
          <Table.Row>
              <Table.HeaderCell key='player1' width={3}>
                Drużyna
              </Table.HeaderCell>
              <Table.HeaderCell key='result1' width={2} colSpan='2'>
                Wynik
              </Table.HeaderCell>
              <Table.HeaderCell key='player2' width={3}>
                Drużyna
              </Table.HeaderCell>
              <Table.HeaderCell key='data' width={2}>
                Data
              </Table.HeaderCell>
              <Table.HeaderCell key='edycja' width={1}>
                
              </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {this.state.matches.map(x => (
            <TableRow key={x._id} data={x} role={this.props.role} />
          ))}
        </Table.Body>
      
        
      </Table>
      )}
      </>
    );
  }
}

export default ScheduleTable;