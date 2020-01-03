import React from 'react';
import Teams from './Teams';
// import { Message, Table } from 'semantic-ui-react';

// import setHeaders from '../../utils/setHeaders';
// import Leagues from '../../Views/Leagues';
import {
  LeaguesTable,
  LeaguesTableRowClosed,
} from '../../components/Leagues';

import Store from '../../Store';

class LeaguesTableInTeamView extends LeaguesTable {

  fetchLeagues = () => {
    // return this.props.query().then(resp => resp.json());
    // console.log( 'query->', this.props.query() );
    return this.props.query();
  };

  componentDidMount = () => {
    // this.fetchLeagues().then(leagues => this.setState({ leagues }));
    this.setState( () => { return { leagues: this.fetchLeagues() }; } )
    // console.log('LeaguesTableInTeamView->', this.props);
  };

}

const LeaguesTableClosed = (leagues) => {
  const config = {
    headers: [
      { width: 3, name: 'Nazwa' },
      { width: 3, name: 'Opis' },
      { width: 2, name: 'Twórca' },
      { width: 2, name: 'Data utworzenia' },
      { width: 2, name: 'Data rozpoczęcia' },
      { width: 2, name: 'Data zakończenia' },
      { width: 2, name: 'Wyniki' },
    ],
    // query: () => fetch('/api/leagues/?status=closed', setHeaders()),
    query: () => { return leagues; },
    row: LeaguesTableRowClosed,
  };
  // return <LeaguesTable {...config} />;
  return <LeaguesTableInTeamView {...config} />;
};


class ComponentTeamViewLeagues extends Teams {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static contextType = Store;

  render() {
    // console.log('ComponentTeamViewLeagues.render()->', this.props.leagues);
    // return(
    // //   <Message info>
    // //   <p>Są jakieś ligi</p>
    // // </Message>
    //   <></>
    // )
    return LeaguesTableClosed(this.props.leagues);
  };

}

export default ComponentTeamViewLeagues;
