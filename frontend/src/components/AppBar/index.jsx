import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import Store from '../../Store';


const AppBar = () => {
  const { isLogged, changeStore, me } = useContext(Store);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    changeStore('isLogged', false);
    changeStore('me', null);
  };
  return (
    <div>
      <div className="center">
        <img alt="nie ma obrazka" src="/images/nowelogo.jpg" />
      </div>
      <Menu secondary>
        <Menu.Item as={Link}   to="/" >
          <p style={{color: '#373c8d', fontWeight: 'bold', fontSize: 'large'}}>
            PANkarzyki</p>
        </Menu.Item>

        {isLogged && (
          <>
          <Menu.Menu>
            <Menu.Item as={NavLink} name="Główna" to="/" activeClassName="active" exact />
            <Menu.Item as={NavLink} name="Terminarz" to="/Schedule" activeClassName="active" />
            <Menu.Item as={NavLink} name="Ligi" to="/Leagues" activeClassName="active" />
            <Menu.Item as={NavLink} name="Drużyny" to="/Teams" activeClassName="active" />
            {/* <Menu.Item as={NavLink} name="Nowa Liga" to="/NewLeague" activeClassName="active" /> */}
            <Menu.Item as={NavLink} name="Wyniki" to="/Scores" activeClassName="active" />
          </Menu.Menu>
          <Menu.Menu position="right">
            <Menu.Item as={Link} name= {me ? me._id: 'user' } to="/Profile" />
            <Menu.Item as={Link} name="Wyjdź" to="/" onClick={handleLogout} />
          </Menu.Menu>
          </>
        )}
        
      </Menu>
    </div>
  );
};

export default AppBar;
