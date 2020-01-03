import React from 'react';
import axios from 'axios';
import Teams from './Teams';
import { Form, Segment, Label, Input, Message } from 'semantic-ui-react';
import Store from '../../Store';

class TeamCreate extends Teams {

  constructor(props) {
    super(props);

    this.state = {
      isMe: false,
      term: '',
      newTeam: '',
      player1: '',
      player2: '',
      errHeader: '',
      errMessage: '',
      warnHeader: '',
      warnMessage: '',
      infoHeader: '',
      infoMessage: '',
      postSuccess: false
    };

    this.teams = [];
    this._gt('forSelect');

    this.users = [];
  }

  static contextType = Store;

  componentDidMount() {
    this.setState( () => { return { isMe: !!this.context.me }; } );
    // console.log('TeamsCreate->', this.context);
    this.getUsers();
  }

  onInputChange = e => {
    const value = e.target.value;
    this.setState(() => {
      return {
        errHeader: '',
        errMessage: '',
        newTeam: value,
      };
    });
  };

  onSelectChange = (e, { value, name }) => {
    switch (name) {
      case 'player1':
        this.setState(() => {
          return {
            player1: value,
            errHeader: '',
            errMessage: '',
          };
        });
        break;
      case 'player2':
        this.setState(() => {
          return {
            player2: value,
            errHeader: '',
            errMessage: '',
          };
        });
        break;
      default:
        break;
    }
  };

  onFormSubmit = (e, d) => {
    e.preventDefault();
    if (d.name !== 'btnCancel') {
      if (this._validateForm()) {
        this._postTeam();
      }
    }
  };

  onClickCancel = (e, d) => {
    // this.setState(() => {
    //   return { postSuccess: true };
    // });
    this.setState( () => { return {
      term: '',
      newTeam: '',
      player1: '',
      player2: '',
      errHeader: '',
      errMessage: '',
      warnHeader: '',
      warnMessage: '',
      infoHeader: '',
      infoMessage: '',
      postSuccess: false
    } } )
  };

  onClickDalej = (e, d) => {
    this.setState( () => { return {
      term: '',
      newTeam: '',
      player1: '',
      player2: '',
      errHeader: '',
      errMessage: '',
      warnHeader: '',
      warnMessage: '',
      infoHeader: '',
      infoMessage: '',
      postSuccess: false
    } } )
  }

  _validateForm = () => {
    let teamOK = true;
    let playersOK = true;
    const team = this.state.newTeam;
    if (team) {
      if (
        this.teams.filter(el => {
          return el.text === team;
        }).length
      ) {
        this.setState(() => {
          return {
            errHeader: 'BŁĄD!',
            errMessage: 'Drużyna o tej nazwie już istnieje',
          };
        });
        teamOK = false;
      } else {
        this.setState(() => {
          return {
            errHeader: '',
            errMessage: '',
          };
        });
      }
    } else {
      this.setState(() => {
        return {
          errHeader: 'BŁĄD!',
          errMessage: 'Drużyna musi mieć nazwę',
        };
      });
      teamOK = false;
    }

    if (!teamOK) {
      return false;
    }

    if (!this.state.player1 || !this.state.player2) {
      this.setState(() => {
        return {
          errHeader: 'BŁĄD!',
          errMessage: 'Musisz wskazać obydwu graczy',
        };
      });
      playersOK = false;
    }
    if (this.state.player1 && this.state.player2 && this.state.player1 === this.state.player2) {
      this.setState(() => {
        return {
          warnHeader: 'UWAGA!',
          warnMessage: 'Właśnie utworzyłeś drużynę jednoosobową',
        };
      });
      playersOK = true;
    }
    return playersOK;
  };

  async _postTeam() {
    // eslint-disable-next-line
    const teams = await axios({
      url: '/api/teams/',
      method: 'post',
      data: {
        name: this.state.newTeam,
        players: {
          first: this.users.filter(el => {
            return el.value === this.state.player1;
          })[0].key,
          second: this.users.filter(el => {
            return el.value === this.state.player2;
          })[0].key,
        },
        status: 'active',
      },
      headers: {
        'x-auth-token': localStorage.token,
      },
    }).then(
      res => {
        // Modyfikuje tablice 'teams' dla playerów - członków drużyny
        this._updateUserTeams(res.data.players.first, res.data._id);
        this._updateUserTeams(res.data.players.second, res.data._id);
        this.setState(() => {
          return {
            postSuccess: true,
            newTeam: '',
            player2: '',
            infoHeader: 'BRAWO!',
            infoMessage: 'Drużyna została zapisana'
          };
        });
      },
      err => {
        console.log('_postTeam', err.errmsg);
      },
    );
  }

  render() {
    // if (this.state.postSuccess) return <Redirect to="/" />;
    return (
      <>
        <Segment.Group horizontal>
          <Segment>
            {/* <Form onSubmit={this, this.onFormSubmit}> */}
            <Form onSubmit={this.onFormSubmit}>
              <Form.Group>
                <Form.Field>
                  <Label>Nazwa drużyny</Label>
                  <Input
                    type="text"
                    placeholder="wprowadź nazwę drużyny..."
                    value={this.state.newTeam}
                    onChange={e => {
                      this.onInputChange(e);
                    }}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field>
                  <Label>Wybierz graczy</Label>
                  <Form.Group inline>
                    {(this.context.me.role === 'admin') && (
                      <Form.Dropdown
                        key="player1"
                        name="player1"
                        placeholder="wskaż gracza 1..."
                        selection
                        value={this.state.player1}
                        options={this.users}
                        onChange={(e, v) => this.onSelectChange(e, v)}
                      />
                    )}
                    {(this.context.me.role === 'player') && (
                      <Form.Dropdown
                        key="player1"
                        name="player1"
                        placeholder="wskaż gracza 1..."
                        selection
                        value={this.state.player1}
                        options={this.users.filter( (el) => { return el.text === `${this.context.me._id}: ${this.context.me.surname}, ${this.context.me.name}`; })}
                        onChange={(e, v) => this.onSelectChange(e, v)}
                      />
                    )}
                    <Form.Dropdown
                      key="player2"
                      name="player2"
                      placeholder="wskaż gracza 2..."
                      selection
                      value={this.state.player2}
                      options={this.users}
                      onChange={(e, v) => this.onSelectChange(e, v)}
                    />
                  </Form.Group>
                </Form.Field>
              </Form.Group>
            </Form>
            {this.state.errHeader + this.state.errMessage !== '' && (
              <Form error>
                <Message error header={this.state.errHeader} content={this.state.errMessage} />
              </Form>
            )}
            {this.state.warnHeader + this.state.warnMessage !== '' && (
              <Form warning>
                <Message
                  warning
                  header={this.state.warnHeader}
                  content={this.state.warnMessage}
                />
              </Form>
            )}
            {this.state.infoHeader + this.state.infoMessage !== '' && (
              <Form success>
                <Message
                  success
                  header={this.state.infoHeader}
                  content={this.state.infoMessage}
                />
                <Form.Button name="btnDalej" onClick={this.onClickDalej}>Dalej</Form.Button>
              </Form>
            )}
          </Segment>
        </Segment.Group>
        {this.state.warnHeader + this.state.warnMessage + this.state.infoHeader + this.state.infoMessage === '' && (
          <Form>
            <Form.Group>
              <Form.Button name="btnSave" onClick={this.onFormSubmit}>Zapisz</Form.Button>
              <Form.Button name="btnCancel" onClick={this.onClickCancel}>Anuluj</Form.Button>
            </Form.Group>
          </Form>
        )}
      </>
    );
  }
}
export default TeamCreate;
