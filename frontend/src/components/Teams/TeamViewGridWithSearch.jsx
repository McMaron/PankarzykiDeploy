import React from 'react';
import TeamViewGrid from './TeamViewGrid';
import _ from 'lodash';
import { Search, Grid } from 'semantic-ui-react';

const initialState = { isLoading: false, results: [], value: '' };
class TeamViewGridWithSearch extends React.Component {
  state = initialState;

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState);

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.name) || re.test(result.player);

      this.setState({
        isLoading: false,
        results: _.filter(this.props.teams, isMatch),
      });
    }, 300);
  };

  render() {
    const { isLoading, value, results } = this.state;
    const teamViewGridProps = { ...this.props, teams: value ? results : this.props.teams };
    return (
      <Grid centered>
        <Grid.Row>
          <Search
            loading={isLoading}
            onSearchChange={_.debounce(this.handleSearchChange, 300, {
              leading: true,
            })}
            results={results}
            value={value}
            open={false}
            input={{ placeholder: 'Wyszukaj po nazwie drużyny lub gracza' }}
          />
        </Grid.Row>
        <Grid.Row>
          <TeamViewGrid {...teamViewGridProps} />
        </Grid.Row>
      </Grid>
    );
  }
}

export default TeamViewGridWithSearch;
