import React from 'react';
import { Grid, Segment, Item, Icon } from 'semantic-ui-react';
import _ from 'lodash';

const TeamViewGridItem = props => {
  const { team, onClick } = props;

  const unpackMatches = team => {
    const matches = team.statistics.matches;
    return `${matches.won + matches.lost}/${matches.won}/${matches.lost}`;
  };

  const unpackGoals = team => {
    const goals = team.statistics.goals;
    return `${goals.for}/${goals.against}/${goals.for - goals.against}`;
  };

  return team.isPlayerInLeague ? (
    <Item className="team-view-grid-item--inactive">
      <Segment>
        <Icon name="users" size="large" />
        <Item.Content>
          <Item.Header>{team.name}</Item.Header>
          <Item.Description>
            Gracz: {team.player} <br />
            Wynik: {unpackMatches(team)}/{unpackGoals(team)}
          </Item.Description>
        </Item.Content>
      </Segment>
    </Item>
  ) : (
    <Item as="a" onClick={onClick} className="team-view-grid-item">
      <Segment>
        <Icon name="users" size="large" />
        <Item.Content>
          <Item.Header>{team.name}</Item.Header>
          <Item.Description>
            Gracz: {team.player} <br />
            Wyniki: {unpackMatches(team)}/{unpackGoals(team)}
          </Item.Description>
        </Item.Content>
      </Segment>
    </Item>
  );
};

const TeamViewGridRow = props => {
  return (
    <Grid.Row>
      {props.teams.map(x => (
        <Grid.Column key={`c_${x.name}`}>
          <TeamViewGridItem team={x} onClick={props.onClickFactory(x)} />
        </Grid.Column>
      ))}
    </Grid.Row>
  );
};

const TeamViewGrid = props => {
  return (
    <Grid columns={props.columns} textAlign="center">
      {_.chunk(props.teams, props.columns).map((x, i) => (
        <TeamViewGridRow key={`r_${i}`} teams={x} onClickFactory={props.onClickFactory} />
      ))}
    </Grid>
  );
};

export default TeamViewGrid;
