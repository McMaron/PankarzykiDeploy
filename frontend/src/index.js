import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';

import Store, { StoreProvider } from './Store';
import setHeaders from './utils/setHeaders';
import AppBar from './components/AppBar';
import PrivateRoute from './components/PrivateRoute';
import Home from './Views/Homepage';
import Login from './Views/Login';
import Teams from './Views/Teams';
import Leagues from './Views/Leagues';
import Schedule from './Views/Schedule';
import Loader from './components/Loader';
import NewLeague from './Views/NewLeague';
import ShowScores from './Views/Scores';
import { Container } from 'semantic-ui-react';
import Profile from './components/Homepage/Profile'

const App = () => {
  const { isLogged, changeStore } = useContext(Store);
  const [isLoading, setLoading] = useState(isLogged);

  useEffect(() => {
    if (!isLogged) return;
    (async () => {
      try {
        const response = await fetch('/api/login/me', setHeaders());
        if (response.status === 400) {
          localStorage.removeItem('token');
          changeStore('isLogged', false);
          changeStore('me', null);
          return;
        }
        const data = await response.json();
        changeStore('isLogged', true);
        changeStore('me', data);
      } catch (ex) {
        console.error('Serwer nie odpowiada'); //Tu wyświetlić coś userowi że nie ma połączenia z serwerem
        console.error('Error', ex);
      }
    })();
    setLoading(false);
  }, [changeStore, isLogged]);
  return (
    <BrowserRouter>
      <Container>
        <AppBar />
        {isLoading ? (
          <Loader />
        ) : (
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute path="/Schedule" component={Schedule} />
            <PrivateRoute path="/Leagues" component={Leagues} />
            <PrivateRoute path="/Teams" component={Teams} />
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/NewLeague" component={NewLeague} />
            <PrivateRoute exact path="/Scores" component={ShowScores} />
            <PrivateRoute exact path="/Profile" component={Profile} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        )}
      </Container>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.querySelector('#root'),
);
