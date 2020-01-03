import React from 'react';
import { Table, Icon, Label } from 'semantic-ui-react';
import { formatDate } from '../../utils/date';
import axios from 'axios';
import AskModal from '../Modals/AskModal';
import setHeaders from '../../utils/setHeaders';

class LeaguesTableRowOwner extends React.Component {
  state = {
    askModalProps: {
      open: false,
    },
  };

  openModalStartLeague = () => {
    const leagueName = this.props.data.name;
    this.setState({
      askModalProps: {
        header: `Czy napewno chcesz wystartować ligę ${leagueName}?`,
        positive: 'Tak',
        negative: 'Nie',
        open: true,
        onClose: this.closeModal,
        onPositive: (endDate, roundsNo) => {
          axios({
            url: `/api/leagues/${leagueName}/start`,
            method: 'PUT',
            ...setHeaders(),
            data: {
              end: endDate,
              rounds: roundsNo,
            }
          }).then(() => {
            this.props.refresh();
          });
        },
      },
    });
  };

  // openModalScheduleLeague = () => {
  //   this.setState({
  //     askModalProps: {
  //       header: `Rozlosować kolejne mecze dla ligi ${this.props.data.name}?`,
  //       positive: 'Tak',
  //       negative: 'Nie',
  //       open: true,
  //       onClose: this.closeModal,
  //       onPositive: () => {
  //         console.log('Positive');
  //       },
  //     },
  //   });
  // };

  openModalCloseLeague = () => {
    this.setState({
      askModalProps: {
        header: `Czy napewno chcesz zamknąć ligę ${this.props.data.name}`,
        positive: 'Tak',
        negative: 'Nie',
        open: true,
        onClose: this.closeModal,
        onPositive: () => {
          console.log('Positive');
        },
      },
    });
  };

  closeModal = () => {
    this.setState({ askModalProps: { open: false } });
  };

  selectLabels = status => {
    if (status === 'created') {
      return (
        <Label as="a" color="blue" ribbon="right" onClick={this.openModalStartLeague}>
          <Icon name="hand pointer" size="large" />
          Rozpocznij ligę
        </Label>
      );
    } else if (status === 'pending') {
      return (
        <div>
          {/* <Label as="a" color="blue" ribbon="right" onClick={this.openModalScheduleLeague}>
            <Icon name="hand pointer" size="large" />
            Rozlosuj mecze
          </Label> */}
          <Label as="a" color="yellow" ribbon="right" onClick={this.openModalCloseLeague}>
            <Icon name="hand pointer" size="large" />
            Zakończ ligę
          </Label>
        </div>
      );
    } else {
      return '';
    }
  };

  render() {
    const { data } = this.props;
    const dateCreated = formatDate(data.date.created);
    const dateStarted = formatDate(data.date.started);
    const dateClosed = formatDate(data.date.closed);
    const labels = this.selectLabels(data.status);
    return (
      <Table.Row>
        <Table.Cell>{data.name}</Table.Cell>
        <Table.Cell>{data.description}</Table.Cell>
        <Table.Cell>{dateCreated}</Table.Cell>
        <Table.Cell>{dateStarted}</Table.Cell>
        <Table.Cell>{dateClosed}</Table.Cell>
        <Table.Cell>{data.status}</Table.Cell>
        <Table.Cell>{data.teams.length}</Table.Cell>
        <Table.Cell textAlign="left">{labels}</Table.Cell>
        <AskModal {...this.state.askModalProps}/>
      </Table.Row>
    );
  }
}

export default LeaguesTableRowOwner;
