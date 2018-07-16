import React, { Component } from 'react';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button, Panel, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      creatingAccount: false,
      email: '',
      userColor: '#2A363F',
      passwordColor: '#2A363F',
      emailColor: '#2A363F',
    }
  }

  render() {
    return (
      <div>
        <Form horizontal onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            {
              this.props.displayLogginError ?
              (<Panel header='Login Error!' bsStyle="danger"></Panel>) : ''
            }
          </FormGroup>
          <div style={{display: 'flex', justifyContent:'center'}}>
            <Image src="http://www.learnpdf.com/wp-content/uploads/2014/01/Icon-Learn-PDF-3-Ways-Training-300px.png" width="300" height="300"/>
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <a style={{color: 'white', fontSize: 50, alignItems: 'center'}}>
              TEACH YO SELF
            </a>
            <br></br>
          </div>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}></Col>
              <Col xs={4} xsOffset={2}>
              <FormControl type='text' placeholder='Username'
                value={this.state.username}
                onChange={(e) => this.setState({ username: e.target.value })}
                onSelect={() => this.setState({userColor: '#00D097', passwordColor: '#2A363F', emailColor: '#2A363F'})}
                style = {{borderColor: `${this.state.userColor}`, borderWidth: 4}}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}></Col>
            <Col xs={4} xsOffset={2}>
              <FormControl type='password' placeholder='Password'
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
                onSelect={(e) => this.setState({passwordColor: '#00D097', userColor: '#2A363F', emailColor: '#2A363F'})}
                style = {{borderColor: `${this.state.passwordColor}`, borderWidth: 4}}
              />
            </Col>
          </FormGroup>
          { this.state.creatingAccount ?
          (<FormGroup>
            <Col componentClass={ControlLabel} sm={2}></Col>
            <Col xs={4} xsOffset={2}>
              <FormControl type='email' placeholder='Email'
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
                onSelect={() => this.setState({emailColor: '#00D097', userColor: '#2A363F', passwordColor: '#2A363F'})}
                style = {{borderColor: `${this.state.emailColor}`, borderWidth: 4}}
              />
            </Col>
          </FormGroup>) : ''
          }
      { !this.state.creatingAccount ? (
          <FormGroup>
            <Col xs={4} xsOffset={4}>
              <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'nowrap'}}>
                <Button bsStyle="" style={{backgroundColor: '#00D097', color: 'white', width: 250, marginLeft: 4, marginRight: 4, boxSizing: 'none'}}
                  onClick={() => this.props.login(this.state.username, this.state.password)}>
                  Log In
                </Button>
                <Button bsStyle="" style={{backgroundColor: '#00D097', color: 'white', width: 250, marginLeft: 4, marginRight: 4, boxSizing: 'none'}}
                  onClick={() => this.setState({ creatingAccount: true })}>
                  Create Account
                </Button>
              </div>
            </Col>
          </FormGroup>
          ) : (
            <FormGroup>
            <Col xs={4} xsOffset={4}>
              <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'nowrap'}}>
                <Button bsStyle="" style={{backgroundColor: '#00D097', color: 'white', width: 250, boxSizing: 'none'}}
                  onClick={() => {
                    this.props.createAccount(this.state.username, this.state.password, this.state.email);
                  }}>
                  Continue
                </Button>
                <Button bsStyle="" style={{backgroundColor: '#2A363F', color: 'white', width: 250, boxSizing: 'none'}}
                  onClick={ () => this.setState({ creatingAccount: false }) }>
                  Go Back
                </Button>
              </div>
          </Col>
            </FormGroup>
          )}
        </Form>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <a href='/login/google'>
            <Image src="assets/google_login.png" width="55%" height="55%"/>
          </a>
        </div>
      </div>
      )
    }
}

export default Login;
