import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Checkbox, Form, Segment } from 'semantic-ui-react';
import Store from '../Store';
import NegativeMessage from './NegativeMessage';
import axios from 'axios';
class Register extends React.Component {
  state = {
    nickname: '',
    email: '',
    password: '',
    passwordr: '',
    name: '',
    surname: '',
    division: 'WRO',
    divisions: [
      { text: 'Wrocek', value: 'WRO', selected: true },
      { text: 'Warszawka', value: 'WAR' },
      { text: 'Kraków', value: 'KRA' },
    ],
    invalidData: false
  };

  static contextType = Store;

  getDivisions = async () => {
    try {
      const { data } = await axios.get('/api/division');
      // console.log(data);
      const divisions = data.filter(({ status }) => status !== 'deleted').map(({ _id }) => ({ value: _id, text: _id }));
      this.setState({ divisions });
    } catch (ex) {
      console.error(ex);
    }
  };

 
  onFormChange = ({ target }, { name, value }) => {
    this.setState({ [name]: value });
  };

  onFormSubmit = async e => {
    e.preventDefault();
    const [nick, email, pass, , name, surname] = e.target;

    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: pass.value,
        nickname: nick.value,
        name: name.value,
        surname: surname.value,
        division: this.state.division,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      alert('Konto utworzone');
      const response = await fetch('api/login',{
        method: 'POST',
        body: JSON.stringify({
          email: email.value,
          password: pass.value
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const token = response.headers.get('x-auth-token');
      localStorage.setItem('token',token);
      await response.json();
      this.context.changeStore('isLogged', true);
    } else {
      this.setState({ invalidData: true});
    }
  };

  render() {
    if (this.context.isLogged) return <Redirect to="/" />;
    return (
      <Segment>
        {this.state.invalidData && <NegativeMessage header="Coś poszło nie tak. Spróbuj ponownie wypełnić formularz" />}
        <Form onSubmit={this.onFormSubmit}>
          <Form.Input name="nickname" label="Nick" placeholder="Nick" onChange={this.onFormChange} />
          <Form.Input name="email" type="email" label="Email" placeholder="Email" onChange={this.onFormChange} />
          <Form.Input type="password" label="Hasło" placeholder="Hasło" onChange={this.onFormChange} />
          <Form.Input type="password" label="Powtórz hasło" placeholder="Powtórz hasło" onChange={this.onFormChange} />
          <Form.Input label="Imie" placeholder="Imie" onChange={this.onFormChange} />
          <Form.Input label="Nazwisko" placeholder="Nazwisko" onChange={this.onFormChange} />
          <Form.Select
            name="division"
            options={this.state.divisions}
            label="Dywizja"
            value={this.state.division}
            onChange={this.onFormChange}
          />
          <Form.Field>
            <Checkbox label="Akceptuje regulamin i zgadzam się z warunkami użytkowania" />
          </Form.Field>
          <Button type="submit">Rejestruj!</Button>
        </Form>
      </Segment>
    );
  }
}

export default Register;
