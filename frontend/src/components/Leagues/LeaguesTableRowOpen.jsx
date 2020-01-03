import React from 'react';
import { Table, Icon, Label, Modal } from 'semantic-ui-react';
import { formatDate } from '../../utils/date';
import AskModal from '../Modals/AskModal';
import setHeaders from '../../utils/setHeaders';
import TeamViewGridWithSearch from '../Teams/TeamViewGridWithSearch';
import axios from 'axios';

const prepareTeams = (name, teams, league) => {
  const unpackPlayer = team => {
    return team.players.first === name ? team.players.second : team.players.first;
  };
  // console.log(league);
  const isPlayerInLeague = player => {
    for (let { team } of league.teams) {
      if (player === team.players.first || player === team.players.second) {
        return true;
      }
    }
    return false;
  };
  for (let team of teams) {
    team.player = unpackPlayer(team);
    team.isPlayerInLeague = isPlayerInLeague(team.player);
  }
  return [...teams.filter(x => !x.isPlayerInLeague), ...teams.filter(x => x.isPlayerInLeague)];
};

class TeamViewModal extends React.Component {
  state = {
    askModalProps: {
      open: false,
    },
  };

  openModalFactory = team => () => {
    this.setState({
      askModalProps: {
        header: `Czy chcesz się zapisać zespołem ${team.name} do ligi ${this.props.league.name}?`,
        positive: 'Tak',
        negative: 'Nie',
        open: true,
        onClose: this.closeModal,
        onPositive: () => {
          axios({
            url: `/api/leagues/${this.props.league.name}/team`,
            method: 'POST',
            ...setHeaders(),
            data: { id: team._id },
          })
            .then(() => {
              this.props.refresh();
            })
            .finally(() => {
              this.props.onClose();
            });
        },
      },
    });
  };

  closeModal = () => {
    this.setState({ askModalProps: { open: false } });
  };

  render() {
    return (
      <Modal open={this.props.open} onClose={this.props.onClose} closeOnDimmerClick={false} closeIcon>
        <Modal.Header>Wybierz drużynę</Modal.Header>
        <Modal.Content scrolling>
          <TeamViewGridWithSearch columns={3} teams={this.props.teams} onClickFactory={this.openModalFactory} />
        </Modal.Content>
        <AskModal {...this.state.askModalProps} />;
      </Modal>
    );
  }
}

class LeaguesTableRowOpen extends React.Component {
  state = {
    isModalOpen: false,
    teams: [],
  };

  openModal = () => {
    const name = localStorage.getItem('id');
    console.log(name)
    axios
      .get(`/api/users/${name}/teams`, setHeaders())
      .then(resp => resp.data)
      .then(teams => this.setState({ teams: prepareTeams(name, teams, this.props.data), isModalOpen: true }))
      .catch(error => console.log(error));
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    const { data, refresh } = this.props;
    const dateCreated = formatDate(data.date.created);
    return (
      <Table.Row>
        <Table.Cell>{data.name}</Table.Cell>
        <Table.Cell>{data.description}</Table.Cell>
        <Table.Cell>{data.owner}</Table.Cell>
        <Table.Cell>{dateCreated}</Table.Cell>
        <Table.Cell>{data.teams.length}</Table.Cell>
        <Table.Cell textAlign="left">
          {data.isUserInLeague ? (
            <Label color="green" ribbon="right">
              <Icon name="thumbs up" size="large" />
              {data.userTeamInLeague}
            </Label>
          ) : (
            <Label as="a" color="blue" ribbon="right" onClick={this.openModal}>
              <Icon name="hand pointer" size="large" />
              Dołącz
            </Label>
          )}
        </Table.Cell>
        <TeamViewModal
          open={this.state.isModalOpen}
          onClose={this.closeModal}
          league={data}
          teams={this.state.teams}
          refresh={refresh}
        />
      </Table.Row>
    );
  }
}

export default LeaguesTableRowOpen;
