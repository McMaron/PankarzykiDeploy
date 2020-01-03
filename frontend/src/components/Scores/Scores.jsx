import React from 'react';
import axios from 'axios';
import Store from '../../Store';

class Scores extends React.Component {
  static contextType = Store;

  async getLeagues(resType = 'names') {
    let ret;
    await axios({
      url: '/api/leagues/?with=["team"]',
      method: 'get',
      data: {},
      headers: {
        'x-auth-token': localStorage.token,
      },
    }).then(
      res => {
        switch (resType) {
          case 'names':
            ret = res.data.map(el => el.name);
            break;
          case 'forSelect':
            ret = res.data.map(el => {
              return {
                key: el._id,
                value: el.name,
                text: el.name,
              };
            });
            break;
          case 'all':
            ret = res.data;
            break;
          default:
            ret = res.data.map(el => el.name);
        }
      },
      err => {
        console.log('Error taki:', err.errmsg);
      },
    );
    return ret;
  }

  gl = async type => {
    try {
      let ret = await this.getLeagues(type);
      switch (type) {
        case 'forSelect':
          this.league = ret.sort((a, b) => (a.text.toLowerCase() < b.text.toLowerCase() ? -1 : 1));
          this.setState(() => {
            return {
              league: this.league[0].text,
              leagueId: this.league[0].key,
            };
          });
          break;
        case 'all':
          this.leagueAll = ret.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
          if (this.leagueAll[0].teams.length > 0) {
            for (let i = 0; i < this.leagueAll[0].teams.length; i++) {
              let actualTeam = this.leagueAll[0].teams[i];
              this.setState(() => {
                // console.log(this.state.data)
                return {
                  data: [
                    ...this.state.data,
                    {
                      team: actualTeam.team.name,
                      points: actualTeam.statistics.matches.won * 3,
                      matchesPlayed: actualTeam.statistics.matches.won + actualTeam.statistics.matches.lost,
                      matchesWon: actualTeam.statistics.matches.won,
                      matchesLost: actualTeam.statistics.matches.lost,
                      matchesTies: actualTeam.statistics.matches.ties,
                      goalsFor: actualTeam.statistics.goals.for,
                      goalsAgainst: actualTeam.statistics.goals.against,
                    },
                  ],
                };
              });
            }
          }
          break;
        default:
          break;
      }
    } catch (e) {
      console.log('gl: Błąd', e);
    }
  };
}

export default Scores;
