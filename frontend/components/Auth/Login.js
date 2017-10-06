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
            <Col componentClass={ControlLabel} sm={2}></Col>
              <Col xs={6} xsOffset={6}>
              <FormControl type='text' placeholder='Username'
                value={this.state.username}
                onChange={(e) => this.setState({ username: e.target.value })}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}></Col>
            <Col xs={6} xsOffset={6}>
              <FormControl type='text' placeholder='Password'
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </Col>
          </FormGroup>
          { this.state.creatingAccount ?
          (<FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Email</Col>
            <Col xs={6} xsOffset={6}>
              <FormControl type='email' placeholder='Email'
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </Col>
          </FormGroup>) : ''
          }
      { !this.state.creatingAccount ? (
          <FormGroup>
            <Col xs={6} xsOffset={6}>
              <Button bsStyle="" style={{backgroundColor: '#6ED9A0', color: 'white', width: 368, boxSizing: 'none'}}
                onClick={() => this.props.login(this.state.username, this.state.password)}>
                Log In!
              </Button>
            </Col>
            <Col xs={6} xsOffset={6}>
              <Button bsStyle="" style={{backgroundColor: '#2A363F', color: 'white', width: 368, boxSizing: 'none'}}
                onClick={() => this.setState({ creatingAccount: true })}>
                Create Account
              </Button>
            </Col>
          </FormGroup>
          ) : (
            <FormGroup>
            <Col xs={6} xsOffset={6}>
              <Button bsStyle="" style={{backgroundColor: '#6ED9A0', color: 'white', width: 368, boxSizing: 'none'}}
                onClick={() => {
                  this.props.createAccount(this.state.username, this.state.password, this.state.email);
                }}>
                Continue
              </Button>
          </Col>
          <Col xs={6} xsOffset={6}>
            <Button bsStyle="" style={{backgroundColor: '#2A363F', color: 'white', width: 368, boxSizing: 'none'}}
              onClick={ () => this.setState({ creatingAccount: false }) }>
              Go Back
            </Button>
          </Col>
            </FormGroup>
          )}
        </Form>
        )
    }
}

export default Login;
