import React from 'react';
import Teams from './Teams';
import ComponentTeamViewLeagues from './TeamViewLeagues'
import { Form, Segment, Label, Input, Table, Divider, Header, Icon, Message, Dropdown } from 'semantic-ui-react';
import Store from '../../Store';

class TeamView extends Teams {

  constructor (props) {
    super(props);

    this.state = { 
      isMe: false,
      editable: false,
      term: '',
      team: '',
      teamId: 0,
      players: {
        first: { 
          _id: '', 
          name: ''
        },
        second: { 
          _id: '',
          name: '' 
        }
      },
      statistics: {
        matches: { 
          won: 0, 
          lost: 0
        },
        goals: { 
          for: 0,
          against: 0 
        }
      },
      leagues: []
    };

    this.teams = [];
    this.teamsAll = [];

    this._gt('forSelect');  // wypełnia tablicę this.teams
    this._gt('all');  // wypełnia tablicę this.teamsAll

  }

  static contextType = Store;

  componentDidMount() {
    this.setState( () => { return { isMe: !!this.context.me }; } );
    // console.log('TeamsView->', this.context);
  }

  onSelectChange = (e, { value, name }) => {
    const index = this.teams.map( (el) => { return el.value; } ).indexOf(value);
    const id = this.teams[ index ].key
    const teamsAllIndex = this.teamsAll.map( (el) => { return el._id; } ).indexOf(id); 
    const players = this.teamsAll[teamsAllIndex].players;
    const stats = this.teamsAll[teamsAllIndex].statistics;
    const leagues = this.teamsAll[teamsAllIndex].leagues;
    this.setState( () => { return { 
      team: value,
      errHeader: '',
      errMessage: '',
      teamId: id,
      players: {
        first: {
          _id: players.first._id,
          name: `${players.first.surname || '(brak)'}, ${players.first.name || '(brak)'}`
        },
        second: {
          _id: players.second._id,
          name: `${players.second.surname || '(brak)'}, ${players.second.name || '(brak)'}`
        }
      },
      statistics: {
        matches: { 
          won: stats.matches.won || 0, 
          lost: stats.matches.lost || 0
        },
        goals: { 
          for: stats.goals.for || 0,
          against: stats.goals.against || 0 
        }
      },
      leagues: leagues
    }})
  }

  onClickEdit = (e, d) => {
    this.setState( () => { return { editable: !this.state.editable }; } )
  }

  onClickCancel = (e, d) => {
    if (this.state.editable) {
      this.setState( () => { return { editable: false }; } )
    }
  }

  onFormSubmit = (e, d) => {
    e.preventDefault();
  }

  onClickVerify = async (e, d) => {
    // sprawdza i ew. uzupełnia listy 'teams', w których występuje 'user'
    // dodatkowy button w komponencie - zakomentowany
    await this._updateUserTeams(this.state.players.first._id, this.state.teamId);
    await this._updateUserTeams(this.state.players.second._id, this.state.teamId);
  }

  render() {
    return (
      <>
        { this.state.isMe && ( <>
        <Segment.Group width={12}>
          <Segment>
            { this.context.me.role === 'player' && <Label>Twoje drużyny:</Label> }
            { this.context.me.role === 'admin' && <Label>Zgłoszone drużyny:</Label> }
            <Dropdown 
            key="teamsSelect"
            name="teamsSelect"
            placeholder="Wybierz z listy..."
            selection value={this.state.team} 
            options={ this.teams } 
            onChange={ (e, v) => this.onSelectChange(e, v) } 
            />
          </Segment>
          <Segment>
            <Form.Group>
              <Divider horizontal>
                <Header as='h4'>
                  <Icon name='group' />
                  Gracze
                </Header>
              </Divider>
              <Input 
                label="Gracz 1:"
                value={ this.state.players.first.name }
                readOnly={ true }
              />
              <Input 
                label="Gracz 2:"
                value={ this.state.players.second.name }
                readOnly={ true }
              />
            </Form.Group>
            <br />
            <Divider horizontal>
              <Header as='h4'>
                <Icon name='columns' />
                Ligi
              </Header>
            </Divider>
            {this.state.leagues.length === 0 && (
              <Message info>
                <p>Wygląda na to, że drużyny nie przypisano do żadnej ligi</p>
              </Message>
            )}
            {this.state.leagues.length !== 0 && (
              <ComponentTeamViewLeagues leagues={this.state.leagues}/>
            )}
            <br />
            <Divider horizontal>
              <Header as='h4'>
                <Icon name='bar chart' />
                Statystyka
              </Header>
            </Divider>
            <Table celled textAlign={"center"}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan={2}>Mecze</Table.HeaderCell>
                  <Table.HeaderCell colSpan={2}>Bramki</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  <Table.HeaderCell>Wygrane</Table.HeaderCell>
                  <Table.HeaderCell>Przegrane</Table.HeaderCell>
                  <Table.HeaderCell>Zdobyte</Table.HeaderCell>
                  <Table.HeaderCell>Stracone</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>{this.state.statistics.matches.won}</Table.Cell>
                  <Table.Cell>{this.state.statistics.matches.lost}</Table.Cell>
                  <Table.Cell>{this.state.statistics.goals.for}</Table.Cell>
                  <Table.Cell>{this.state.statistics.goals.against}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Segment>
        </Segment.Group>
        <Form>
          {/* { this.state.editable && <Form.Button name='btnVerify' onClick={this.onClickVerify} floated='right'>Weryfikuj</Form.Button> } */}
          <Form.Group>
            { !this.state.editable && <Form.Button name="btnEdit" onClick={this.onClickEdit} floated='left'>Edytuj</Form.Button> }
            { this.state.editable && <Form.Button name="btnSave" onClick={this.onFormSubmit} floated='left'>Zapisz</Form.Button> }
            { this.state.editable && <Form.Button name="btnCancel" onClick={this.onClickCancel}>Anuluj</Form.Button>}
          </Form.Group>
        </Form>
      </>)}
    </> )
  };
}

export default TeamView;
