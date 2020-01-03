import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import Store from '../../Store';
// import News from './News'

class TopMenu extends Component {
  state = { activeItem: 'news' }

  static contextType = Store;

  componentDidMount() {
    this.setState(() => { return { isMe: this.context.me }; });
    // console.log(this)
    // console.log(this.context.me);

    // console.log(this.context.me.division);
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <div>
        <Menu attached='top' tabular widths={2}>
          <Menu.Item
            name="news"
            active={activeItem === 'news'}
            onClick={this.handleItemClick}
          >
            <Icon name="user" />
            Aktualności
          </Menu.Item>
          <Menu.Item
            name="profile"
            active={activeItem === 'profile'}
            onClick={this.handleItemClick}
          >
            <Icon name="user" />
            Profil użytkownika
            {/* {me.name + " " + me.surname} */}
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}

export default TopMenu;
