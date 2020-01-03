import React from 'react';
import axios from 'axios';
import SubPage from '../../components/SubPage';
import setHeaders from '../../utils/setHeaders';
import { Segment } from 'semantic-ui-react';
import {
  LeaguesTable,
  LeaguesTableRowOpen,
  LeaguesTableRowPending,
  LeaguesTableRowClosed,
  LeaguesTableRowOwner,
} from '../../components/Leagues';
import CreateLeague from '../NewLeague/index';

const queryLeaguesTableOpen = async () => {
  const isUserInLeague = (league, user = localStorage.getItem('id')) => {
    for (let { team } of league.teams) {
      if (user === team.players.first || user === team.players.second) {
        return [true, team.name];
      }
    }
    return [false, ''];
  };
  const leagues = await axios.get('/api/leagues/?status=created&with=["team"]', setHeaders()).then(resp => resp.data);
  for (let league of leagues) {
    const [inLeague, teamName] = isUserInLeague(league);
    league['isUserInLeague'] = inLeague;
    league['userTeamInLeague'] = teamName;
  }
  return leagues;
};

const LeaguesTableOpen = () => {
  const config = {
    headers: [
      { width: 3, name: 'Nazwa' },
      { width: 4, name: 'Opis' },
      { width: 3, name: 'Twórca' },
      { width: 3, name: 'Data utworzenia' },
      { width: 1, name: 'Zapisanych drużyn' },
      { width: 2, name: 'Drużyna' },
    ],
    query: queryLeaguesTableOpen,
    row: LeaguesTableRowOpen,
  };
  return <LeaguesTable {...config} />;
};

const LeaguesTablePending = () => {
  const config = {
    headers: [
      { width: 3, name: 'Nazwa' },
      { width: 3, name: 'Opis' },
      { width: 3, name: 'Twórca' },
      { width: 2, name: 'Data utworzenia' },
      { width: 2, name: 'Data rozpoczęcia' },
      { width: 1, name: 'Zapisanych drużyn' },
      { width: 2, name: 'Info' },
    ],
    query: () => axios.get('/api/leagues/?status=pending', setHeaders()).then(resp => resp.data),
    row: LeaguesTableRowPending,
  };
  return <LeaguesTable {...config} />;
};

const LeaguesTableClosed = () => {
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
    query: () => axios.get('/api/leagues/?status=closed', setHeaders()).then(resp => resp.data),
    row: LeaguesTableRowClosed,
  };
  return <LeaguesTable {...config} />;
};

const LeaguesTableOwner = () => {
  const config = {
    headers: [
      { width: 2, name: 'Nazwa' },
      { width: 2, name: 'Opis' },
      { width: 2, name: 'Data utworzenia' },
      { width: 2, name: 'Data rozpoczęcia' },
      { width: 2, name: 'Data zakończenia' },
      { width: 2, name: 'Status' },
      { width: 2, name: 'Drużyny' },
      { width: 2, name: 'Akcje' },
    ],
    query: () => axios.get('/api/leagues/?status=owner', setHeaders()).then(resp => resp.data),
    row: LeaguesTableRowOwner,
  };
  return <LeaguesTable {...config} />;
};

const Leagues = props => {
  const path = props.match.path;
  const routing = [
    { name: 'Otwarte', path: `${path}/Open`, component: LeaguesTableOpen },
    { name: 'Trwające', path: `${path}/Pending`, component: LeaguesTablePending },
    { name: 'Zakończone', path: `${path}/Closed`, component: LeaguesTableClosed },
    { name: 'Moje', path: `${path}/Owner`, component: LeaguesTableOwner },
    { name: 'Nowa Liga', path: `${path}/NewLeague`, component: CreateLeague}
  ];

  return (
    <Segment>
      {' '}
      <SubPage routing={routing} />{' '}
    </Segment>
  );
};

export default Leagues;
