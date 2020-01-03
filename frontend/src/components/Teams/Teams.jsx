import React from 'react';
import axios from 'axios';
import Store from '../../Store';

class Teams extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isMe: false
    }
  }

  static contextType = Store;

  componentDidMount() {
    this.setState(() => { return { isMe: !!this.context.me }; });
    // console.log('Teams->', this.context);
  }

  async getUsers(division = '') {
    await axios(
      {
        url: `/api/users?division=${this.context.me.division}`,
        method: 'get',
        data: {},
        headers:
        {
          'x-auth-token': localStorage.token
        }
      }
    ).then(
      (res) => {
        this.users = res.data.map((el) => {
          return {
            key: el._id,
            value: `${el.surname}, ${el.name}`,
            text: `${el._id}: ${el.surname || '(brak)'}, ${el.name || '(brak)'}`
          };
        }).sort((a, b) => { return (a.text.toLowerCase() < b.text.toLowerCase()) ? -1 : 1; });
      },
      (err) => { console.log('getUsers->', err.errmsg); }
    )
  }

  async _getTeams(resType = 'names', id) {
    let ret;
    await axios(
      {
        url: `/api/teams/`,
        method: 'get',
        data: {},
        headers:
        {
          'x-auth-token': localStorage.token
        }
      }
    ).then(
      (res) => {
        switch (resType) {
          case 'names':
            ret = res.data.map((el) => { return el.name; });
            break;
          case 'forSelect':
            if (this.context.me.role === 'admin') {
              ret = res.data.map((el) => {
                return {
                  key: el._id,
                  value: el.name,
                  text: el.name
                };
              });
            } else {
              ret = res.data
                .filter((el) => {
                  return (el.players.first._id === this.context.me._id) || (el.players.second._id === this.context.me._id);
                })
                .map((el) => {
                  return {
                    key: el._id,
                    value: el.name,
                    text: el.name
                  };
                });
              // if (ret.length === 0) {
              //   ret = [{
              //     key: '0',
              //     value: '',
              //     text: ''
              //   }]
              // }
            }
            break;
          case 'all':
            if (this.context.me.role === 'admin') {
              ret = res.data;
            } else {
              ret = res.data.filter((el) => {
                return (el.players.first._id === this.context.me._id) || (el.players.second._id === this.context.me._id);
              });
            }
            break;
          default:
            if (this.context.me.role === 'admin') {
              ret = res.data.map((el) => { return el.name; });
            } else {
              ret = res.data
                .filter((el) => {
                  return (el.players.first._id === this.context.me._id) || (el.players.second._id === this.context.me._id);
                })
                .map((el) => { return el.name; });
            }
        };
      },
      (err) => { console.log('_getTeams->', err.errmsg); }
    )
    return ret;
  }

  _gt = async (type) => {
    let ret;
    try {
      ret = await this._getTeams(type);
      switch (type) {
        case 'forSelect':
          this.teams = ret;
          this.teams.sort((a, b) => { return (a.text.toLowerCase() < b.text.toLowerCase()) ? -1 : 1; });
          this.setState(
            () => {
              if (this.teams.length === 0) {
                return {
                  team: '',
                  teamId: ''
                }
              } else {
                return {
                  team: this.teams[0].text,
                  teamId: this.teams[0].key
                }
              }
            }
          );
          break;
        case 'all':
          this.teamsAll = ret;
          this.teamsAll.sort((a, b) => { return (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1; });
          this.setState(
            () => {
              if (this.teamsAll.length === 0) {
                return {
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
                }
              } else {
                return {
                  players: {
                    first: {
                      _id: this.teamsAll[0].players.first._id,
                      name: `${this.teamsAll[0].players.first.surname || '(brak)'}, ${this.teamsAll[0].players.first.name || '(brak)'}`
                    },
                    second: {
                      _id: this.teamsAll[0].players.second._id,
                      name: `${this.teamsAll[0].players.second.surname || '(brak)'}, ${this.teamsAll[0].players.second.name || '(brak)'}`
                    }
                  },
                  statistics: {
                    matches: {
                      won: this.teamsAll[0].statistics.matches.won,
                      lost: this.teamsAll[0].statistics.matches.lost
                    },
                    goals: {
                      for: this.teamsAll[0].statistics.goals.for,
                      against: this.teamsAll[0].statistics.goals.against
                    }
                  },
                  leagues: this.teamsAll[0].leagues
                }
              }
            }
          );
          break;
        default:
          break;
      }
    }
    catch (e) { console.log('_gt: Coś nie tak', e.errmsg); };
  }

  _getDivisions() {
    return [
      // powinno się ciągnąć z bazy, ale nie znalazłem endpointa na razie...
      { key: 'WRO', value: 'WRO', text: 'Wrocław' },
      { key: 'KRK', value: 'KRK', text: 'Kraków' },
      { key: 'WAW', value: 'WAW', text: 'Warszawa' },
      { key: 'League_Division_0', value: 'League_Division_0', text: 'League_Division_0' },
    ];
  }

  _updateUserTeams = async (userId, teamId) => {
    let user = await axios({
      url: `/api/user/${userId}`,
      method: 'get',
      data: {},
      headers: {
        'x-auth-token': localStorage.token,
      }
    });
    const teams = [...user.data.teams];
    if (user.data.teams.indexOf(teamId) < 0) { teams.push(teamId); 
      user.data.teams = [...teams];
      user = await axios({
        url: `/api/user/${userId}`,
        method: 'put',
        data: { teams: teams},
        headers: {
          'x-auth-token': localStorage.token,
        }
      });
    };
  }

}

export default Teams;
