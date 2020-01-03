import React from 'react';
import axios from 'axios';
import {Grid, Segment, Divider} from 'semantic-ui-react';
import {  ScheduleTable, DropdownLeague, DropdownRole, DropdownStatus} from '../../components/Schedule';
import Store from '../../Store';


const filterMyTeams = (obj, myName) => {
   return obj.status === 'active' &&  
   (obj.players.first.name === myName ||
     obj.players.second.name === myName )
}

const amIPlayingThisLeague = (league, myTeams) => {
  let result = false;
  for (let y = 0; y < myTeams.length; y++) {
    for (let i=0; i < league.teams.length; i++) {
      if (myTeams[y]._id === league.teams[i].team) {
        result = true;
      }
      if (result) break;
    };
  };
  return result;
}

class ScheduleView extends React.Component {
  static contextType = Store;

  state = {
    status: '',
    role: '',
    leagues: [],
    leaguesChoice: [],
    chosenLeague: '',
    teams: []
  }
  
  onStatusChange = async (e, {value}) => {
    await this.setState( {status: value});
    this.onChangeLeagueFilter();
  }   
  onRoleChange = async (e, {value}) =>  {
    await this.setState( {role: value});
    this.onChangeLeagueFilter();
  }
  onLeagueChange =  async (e, {value}) =>  {
    await this.setState({ chosenLeague: value})   
  }

  onChangeLeagueFilter = () => {
    let tempLeagues = [];
    
    if (this.state.role === 'attending')
      tempLeagues = this.state.leagues.filter( obj => amIPlayingThisLeague(obj, this.state.teams) && obj.status === this.state.status)
    else if (this.state.role === 'mygames') {
      tempLeagues = this.state.leagues.filter( obj =>obj.owner === this.context.me._id && obj.status === this.state.status )
    }
    else tempLeagues = this.state.leagues.filter( obj => obj.status === this.state.status) 
    this.setState({ chosenLeague: '', leaguesChoice: tempLeagues.map((obj, index) => { return {key: index, value: obj._id, text: obj.name}})
    });
  }


  componentDidMount() {
    
    axios({
      url: '/api/leagues',
      method: 'get',
      headers: {
          'x-auth-token': localStorage.getItem('token'),
      },
    }).then( result => {
      this.setState({ leagues: result.data.filter(obj => obj.division === this.context.me.division )});
    })

    axios({
      url: '/api/teams',
      method: 'get',
      headers: {
          'x-auth-token': localStorage.getItem('token'),
    },
    }).then( result => {
      this.setState({ teams: result.data.filter(obj => filterMyTeams(obj, this.context.me.name) )
        .map(obj => {return {_id: obj._id, name: obj.name}})
       });
    })    
  }

  

  render() {
    return (
      <Segment>
        <Grid>
          <Grid.Column width={3}>
            <DropdownRole triggerChange={this.onRoleChange} />
            <Divider horizontal/>
            <DropdownStatus triggerChange={this.onStatusChange} />
            <Divider horizontal/>
            { this.state.role && this.state.status && (
              <DropdownLeague options={this.state.leaguesChoice} triggerChange={this.onLeagueChange} />
            )}
            
          </Grid.Column>
          <Grid.Column stretched width={13}>
            {this.state.chosenLeague && (
              <ScheduleTable league={this.state.chosenLeague} teams={this.state.teams} role ={this.state.role}/>
            )}
          </Grid.Column>
        </Grid>
      </Segment>
  );}
};

export default ScheduleView;