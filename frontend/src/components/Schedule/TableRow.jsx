import React from 'react';
import axios from 'axios';
import { Table, Label, Icon, Input } from 'semantic-ui-react';
// import NegativeMessage from '../NegativeMessage'

class TableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            isEditable: this.props.role === 'mygames' || (this.props.data.myGame && !this.props.data.goals),
            status: this.props.data.status,
            matchID: this.props.data._id,
            firstTeamID: this.props.data.teams.first._id,
            firstTeamGoals: this.props.data.goals? this.props.data.goals.first: '',
            firstTeamPrevGoals: this.props.data.goals? this.props.data.goals.first: '',
            secondTeamID: this.props.data.teams.second._id,
            secondTeamGoals: this.props.data.goals? this.props.data.goals.second: '',
            secondTeamPrevGoals: this.props.data.goals? this.props.data.goals.second: '',
        };
      }

handleGoalsChange = event => {
    const value = event.target.value;
    const name = event.target.name;
    if (value.length <= 2) {
        this.setState({
            [name]: value.replace(/\D/,''),
          });
    }    
  };

saveScore = () => {
    if (!this.state.firstTeamGoals || !this.state.secondTeamGoals) {
        console.log('wychodze')
        return
    }
    axios({
        url: `/api/matches/${this.state.matchID}/score`,
        method: 'put',
        headers: {'x-auth-token': localStorage.getItem('token'),},
        data: {
            firstTeam: {
                id: this.state.firstTeamID,
                goals: this.state.firstTeamGoals,
                prevGoals: this.state.firstTeamPrevGoals
            },
            secondTeam: {
                id: this.state.secondTeamID,
                goals: this.state.secondTeamGoals,
                prevGoals: this.state.secondTeamPrevGoals
            },
            status: this.state.status
        }
      }).then(  result => {
          if (parseInt(this.state.firstTeamGoals) === result.data.goals.first & 
            parseInt(this.state.secondTeamGoals) === result.data.goals.second) {
                this.setState({ isEditable: false})
            }; 
      }).catch( error => {
          console.log(error)
      }) 
};

// isEditable() {
//     // console.log(this.props)
//     return (this.props.role === 'mygames' || (this.props.data.myGame && !this.props.data.goals));
// };

render() {
    return (
            <Table.Row>
            <Table.Cell>
                <b>{this.props.data.teams.first.name}</b> <br></br> 
                {this.props.data.teams.first.players.first} / {this.props.data.teams.first.players.second}
            </Table.Cell>
            <Table.Cell>
                <Input 
                    name='firstTeamGoals'
                    fluid 
                    disabled={!this.state.isEditable}
                    value={this.state.firstTeamGoals}
                    onChange={this.handleGoalsChange}> 
                </Input>
            </Table.Cell>
            <Table.Cell>
                <Input 
                    name='secondTeamGoals'
                    fluid 
                    disabled={!this.state.isEditable}
                    value={this.state.secondTeamGoals}
                    onChange={this.handleGoalsChange}> 
                </Input>
            </Table.Cell>
            <Table.Cell>
                <b>{this.props.data.teams.second.name}</b> <br></br> 
                {this.props.data.teams.second.players.first} / {this.props.data.teams.second.players.second}
            </Table.Cell>
            <Table.Cell>{this.props.data.date.scheduled.substring(0,10)}</Table.Cell>
            <Table.Cell textAlign="left" collapsing>
            { this.state.isEditable &&  (
                <Label 
                    as="a" 
                    color="blue" 
                    ribbon='right'
                    onClick={this.saveScore}>
                    <Icon name="hand pointer" size="large" />
                    Zapisz
                </Label>
            )}
            </Table.Cell>
            </Table.Row>
    )
}

}

export default TableRow;