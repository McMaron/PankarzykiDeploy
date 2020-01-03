import React from 'react';
import { Route, NavLink, Redirect, Switch } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import { Grid, Menu } from 'semantic-ui-react';

const SubPageRouter = props => {
  return (
    <Switch>
      {props.routing.map(x => (
        <PrivateRoute key={x.path} path={x.path} component={x.component} />
      ))}
      <Route render={() => <Redirect to={props.routing[0].path || '/'} />} />
    </Switch>
  );
};

const SubPageMenu = props => {
  return (
    <Menu fluid vertical tabular>
      {props.routing.map(x => (
        <Menu.Item key={x.path} as={NavLink} name={x.name} to={x.path} activeClassName="active" />
      ))}
    </Menu>
  );
};

const SubPage = props => {
  return (
    <div>
      <Grid>
        <Grid.Column width={3}>
          <SubPageMenu routing={props.routing} />
        </Grid.Column>
        <Grid.Column stretched width={13}>
          <SubPageRouter routing={props.routing} />
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default SubPage;
