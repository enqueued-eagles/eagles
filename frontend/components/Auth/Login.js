import React, { Component } from 'react';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button, Panel } from 'react-bootstrap';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      creatingAccount: false,
      email: ''
    }
  }

  render() {
    return (
        <Form horizontal onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            {
              this.props.displayLogginError ? 
              (<Panel header='Login Error!' bsStyle="danger"></Panel>) : ''
            }
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Username</Col>
            <Col sm={10}>
              <FormControl type='text' placeholder='Username'
                value={this.state.username}
                onChange={(e) => this.setState({ username: e.target.value })}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Password</Col>
            <Col sm={10}>
              <FormControl type='password' placeholder='Password'
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </Col>
          </FormGroup>
          { this.state.creatingAccount ?
          (<FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Email</Col>
            <Col sm={10}>
              <FormControl type='email' placeholder='Email'
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </Col>
          </FormGroup>) : ''
          }
      { !this.state.creatingAccount ? (
          <FormGroup>
            <Col smOffset={2} sm={2}>
              <Button onClick={() => this.props.login(this.state.username, this.state.password)}>
                Log In!
              </Button>
              <Button onClick={() => this.setState({ creatingAccount: true })}>
                Create Account
              </Button>
            </Col>
          </FormGroup>
          ) : (
            <FormGroup>
            <Col smOffset={2} sm={2}>
              <Button onClick={ () => this.setState({ creatingAccount: false }) }>
                Go Back
              </Button>
              <Button onClick={() => {
                this.props.createAccount(this.state.username, this.state.password, this.state.email);
                }}>
                Create Account!
              </Button>
            </Col>
            </FormGroup>
          )}
        </Form>
        )
    }
}

export default Login;