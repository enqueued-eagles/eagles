import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonToolbar, Form, FormGroup, ControlLabel, FormControl, Navbar, Image } from 'react-bootstrap';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: ''
    }
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  retrieveSearchInput(searchInput) {
    this.setState({
      searchInput: searchInput.target.value
    });
  }

  handleSearchSubmit(event) {
    event.preventDefault();
    this.props.queryDataBaseWithSearchInput(this.state.searchInput);
  }


  render(props) {
    return (
      <div>
        <Navbar>
          <Navbar.Form>
            <Form
              onSubmit={ (e) => {
                e.preventDefault();
                this.retrieveSearchInput.call(this, event);
                this.props.history.push('/');
              }}>
              <FormGroup>
                <FormControl style={{width: 220}} type='text' placeholder='Search tags!' onChange={this.retrieveSearchInput.bind(this)}/>
              </FormGroup>
              <Link to='/'>
                <Button type="submit" onClick={ (event) => {
                  this.handleSearchSubmit(event);
                  this.props.history.push('/');
                }}>
                Search
                </Button>
              </Link>
          <div className="navbar-right">
            <Link to='/create'>
              <Button bsStyle="" className="buttonz">Create</Button>
            </Link>
            <Link to='/'>
              <Button onClick={ this.props.getLessons } bsStyle="" className="buttonz">Home</Button>
            </Link>
            <Link to={'/user/' + this.props.user}>
              <Button bsStyle="" className="buttonz">Profile</Button>
            </Link>
            <Button onClick={this.props.logout} bsStyle="" className="buttonz">Logout</Button>
          </div>
        </Form>
      </Navbar.Form>
    </Navbar>
  </div>
    );
  }
}

export default NavBar;


// Can change input and button to elements within a form field which should mean you can submit by hitting enter as well as clicking submit
