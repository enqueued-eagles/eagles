import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem, Header, Button } from 'react-bootstrap';
import { ListGroup, DropdownButton, ButtonGroup, MenuItem } from 'react-bootstrap';
import { Grid, Row, Col, Nav, NavItem, Form, FormControl } from 'react-bootstrap';
import { FormGroup, ControlLabel, Tab, FieldGroup } from 'react-bootstrap'
import { Panel, Modal, ProgressBar, OverlayTrigger } from 'react-bootstrap';
import LessonPreviewContainer from './Lesson/LessonPreviewContainer';
import LessonPreview from './Lesson/LessonPreview';
import axios from 'axios';


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //currentURL is ghetto React Router
      currentURL:'',
      //currentUser is pulled from the active page's URL
      currentUser: this.props.user,
      currentUserLessons: [],
      currentUserFavorites: [],
      //browsingUser is the user logged in
      browsingUser: this.props.user,
      browsingUserLessons: [],
      browsingUserFavorites: [],
      //state to trigger the update alert box
      update:false,
      //state for progress bar
      progress:0
    }
    this.deleteLesson = this.deleteLesson.bind(this);
    this.changeAvatarURL = this.changeAvatarURL.bind(this)
    this.render = this.render.bind(this)
    this.submitOverview = this.submitOverview.bind(this)
    this.updatecurrentUser = this.updatecurrentUser.bind(this)
    this.updatebrowsingUser = this.updatebrowsingUser.bind(this)
    this.closeUpdate = this.closeUpdate.bind(this)
    this.updateProgressBar = this.updateProgressBar.bind(this)
  }

  componentDidMount() {
    this.setState({
      currentURL:window.location.pathname.slice(6)
    })
    this.updatebrowsingUser()
    this.updatecurrentUser()
  }

  updateProgressBar() {
    let int = 0;
    if (this.state.browsingUser.fullName) int++
    if (this.state.browsingUser.location) int++
    if (this.state.browsingUser.website) int++
    if (this.state.browsingUser.githubURL) int++
    if (this.state.browsingUser.emailPublic) int++
    //since there are 5 fields, 100/5 is 20
    int = int*20
    console.log('progress int', int)
    this.setState({
      progress: int
    })
  }

  closeUpdate(){
    this.setState({
      update: false
    })
  }

  updatecurrentUser (){
    console.log(`updatecurrentUser ${window.location.pathname.slice(6)}`)
    this.setState({
      currentURL:window.location.pathname.slice(6)
    })
    axios.patch(`/api/user/${window.location.pathname.slice(6)}`)
    .then((user) => {
      this.setState({currentUser:user.data[0]})
      console.log(`updatecurrentUserresponse`, this.state.currentUser)
      // ... i'm too lazy to fix this legacy code
      this.props.getLessons()
      .then((unfilteredLessons) => {
        return {
          lessons: unfilteredLessons.filter(lsn => this.state.currentUser._id === lsn.userRef),
          favoriteLessons: unfilteredLessons.filter(lsn => lsn.userLikes.indexOf(this.state.currentUser.username) >= 0)
        }
      })
      .then((booger) => {
        this.setState({
          currentUserLessons: booger.lessons,
          currentUserFavorites: booger.favoriteLessons
        })
        console.log('booger currentUserLessons', this.state.currentUserLessons)
        console.log('booger currentUserFavorites', this.state.currentUserFavorites)

      })
      .catch((err) => console.error('inner updatecurrentUser Error, lessons! ', err));
    })
    .catch((err) => console.error('outer updatecurrentUser Error! ', err));
  }

  updatebrowsingUser(){
    console.log(`updatebrowsingUser ${this.props.user.username}`)
    axios.patch(`/api/user/${this.props.user.username}`)
    .then((user) => {
      this.setState({browsingUser:user.data[0]})
      console.log(`updatebrowsingUser response`, this.state.browsingUser)
      // ... i'm too lazy to fix this legacy code
      this.props.getLessons()
      .then((unfilteredLessons) => {
        return {
          lessons: unfilteredLessons.filter(lsn => this.state.browsingUser._id === lsn.userRef),
          favoriteLessons: unfilteredLessons.filter(lsn => lsn.userLikes.indexOf(this.state.browsingUser.username) >= 0)
        }
      })
      .then((booger) => {
        this.setState({
          browsingUserLessons: booger.lessons,
          browsingUserFavorites: booger.favoriteLessons
        })
        this.updateProgressBar()
        console.log('booger browsingUserLessons', this.state.browsingUserLessons)
        console.log('booger browsingUserFavorites', this.state.browsingUserFavorites)

      })
      .catch((err) => console.error('inner browsingUserUser Error, lessons! ', err));
    })
    .catch((err) => console.error('outer browsingUserUser Error! ', err));
  }

  deleteLesson(lessonId) {
    return fetch('/api/lessons/' + lessonId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then(
      this.updatebrowsingUser()
    )
    .catch((err) => console.error('Error deleting lessons', err));
  }

  changeAvatarURL(e) {
    e.preventDefault();
    let data = {};
    data.userId = this.state.browsingUser._id
    data.avatarURL = this.avatarURL.value
    axios.put('/api/user', {'data':data})
    .then( (res) => {
      this.updatebrowsingUser()
    })
    .catch( (err) => console.error('changeAvatarURL axios err', err) )
  }

  submitOverview(e){
    e.preventDefault();
    this.setState({
      update: true
    })
    let data={};
    data.userId = this.state.browsingUser._id
    data.fullName = this.fullName.value
    data.location = this.location.value
    data.website = this.website.value
    data.githubURL = this.githubURL.value
    data.emailPublic = this.emailPublic.value
    data.emailLikeGoal = this.emailLikeGoal.value
    data.email = this.email.value
    axios.put('/api/user',{'data':data})
    .then( (res) => {
      axios.get(`/api/user/${this.state.browsingUser._id}`)
      .then((user) => {
        console.log('newuser',user)
        this.updatebrowsingUser()
      })
    })
    .catch( (err) => console.error('submitOverview axios err', err) )
  }

  render() {
    console.log(this.state.update)
    console.log('render this.props.user', this.props.user)
    console.log('render this.state.currentUser', this.state.currentUser)
    console.log('render this.state.browsingUser', this.state.browsingUser)
    console.log('render this.state.browsingUserLessons', this.state.browsingUserLessons)
    if(this.props.user.username === window.location.pathname.slice(6)){
      console.log('rendering user edit page')
      return (
        <Grid>
          <Modal
            bsSize="small"
            show={this.state.update}
            onHide={this.closeUpdate}
          >
            <Modal.Header>
              <Modal.Title>Changes Received</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Your information has been updated.
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeUpdate}>Close</Button>
            </Modal.Footer>
          </Modal>
          <Row className = "userEdit">
            <Col md={3}>
              <img
                height = "200px"
                width = "200px"
                alt="Avatar"
                src={this.state.browsingUser.avatarURL}>
              </img>
              <br></br>
              <Form inline onSubmit={this.changeAvatarURL}>
                <FormGroup controlId="avatarURL" >
                  <ControlLabel style={{color: 'white'}}> Avatar URL:</ControlLabel>
                  <FormControl
                  inputRef={ (input) => this.avatarURL = input }
                  type="text"
                  placeholder={this.state.browsingUser.avatarURL}/>
                </FormGroup>
                <Button type="submit">Change</Button>
              </Form>
              <br></br>
              <b style={{color: 'white'}}>Profile Completion:</b>
              <ProgressBar
                active
                label={`${this.state.progress}%`}
                now={this.state.progress}
              />
            </Col>
            <Tab.Container id="userEditTabs" defaultActiveKey="overview">
              <Col md={9}>
                <Nav bsStyle ="tabs" justified
                onSelect = {this.handleTabSelect}>
                  <NavItem eventKey="overview" title="Overview" style={{color: 'white'}}>Overview</NavItem>
                  <NavItem eventKey="lessons" title="Lessons" style={{color: 'white'}}>Lessons</NavItem>
                  <NavItem eventKey="favorites" title="Favorites" style={{color: 'white'}}>Favorites</NavItem>
                </Nav>
                <Tab.Content animation>
                    <Tab.Pane eventKey="overview">
                      <Form onSubmit={this.submitOverview}>
                        <FormGroup >
                          <ControlLabel style={{color: 'white'}}> Full Name:</ControlLabel>
                          <FormControl
                          inputRef={ (input) => this.fullName = input }
                          type="text"
                          placeholder={this.state.browsingUser.fullName || "What's your name?"}/>
                        </FormGroup>
                        <FormGroup >
                          <ControlLabel style={{color: 'white'}}> Location:</ControlLabel>
                          <FormControl
                          inputRef={ (input) => this.location = input }
                          type="text"
                          placeholder={this.state.browsingUser.location || "Where are you located?"}/>
                        </FormGroup>
                        <FormGroup >
                          <ControlLabel style={{color: 'white'}}> Website:</ControlLabel>
                          <FormControl
                          inputRef={ (input) => this.website = input }
                          type="text"
                          placeholder={this.state.browsingUser.website || "Do you have a website?"}/>
                        </FormGroup>
                        <FormGroup >
                          <ControlLabel style={{color: 'white'}}> Notification E-mail Address:</ControlLabel>
                          <FormControl
                          inputRef={ (input) => this.email = input }
                          type="text"
                          placeholder={this.state.browsingUser.email || "Where do you want your notifications sent?"}/>
                        </FormGroup>
                        <FormGroup >
                          <ControlLabel style={{color: 'white'}}> Public E-mail Address:</ControlLabel>
                          <FormControl
                          inputRef={ (input) => this.emailPublic = input }
                          type="text"
                          placeholder={this.state.browsingUser.emailPublic || "Where do you want the public to email you?"}/>
                        </FormGroup>
                        <FormGroup >
                          <ControlLabel style={{color: 'white'}}> Github:</ControlLabel>
                          <FormControl
                          inputRef={ (input) => this.githubURL = input }
                          type="text"
                          placeholder={this.state.browsingUser.githubURL || "What's your GitHub Account?"}/>
                        </FormGroup>
                        <FormGroup >
                          <ControlLabel style={{color: 'white'}}> Email me every x likes:</ControlLabel>
                          <FormControl
                          inputRef={ (input) => this.emailLikeGoal = input }
                          type="text"
                          placeholder={this.state.browsingUser.emailLikeGoal || "x"}/>
                        </FormGroup>
                        <Button type="submit">
                          Save
                        </Button>
                      </Form>
                    </Tab.Pane>
                    <Tab.Pane eventKey="lessons">
                      <ListGroup>
                        {this.state.browsingUserLessons.map((lesson, i) =>
                          <LessonPreview
                            lesson={lesson}
                            index={i}
                            key={i}
                            sessionUserId={this.state.currentUser._id}
                            deleteLesson = {this.deleteLesson}
                          />
                        )}
                      </ListGroup>
                    </Tab.Pane>
                    <Tab.Pane eventKey="favorites">
                    <ListGroup bsStyle="danger">
                        {this.state.browsingUserFavorites.map((lesson, i) =>
                          <LessonPreview
                            lesson={lesson}
                            index={i}
                            key={i}
                            sessionUserId={this.state.currentUser._id}
                          />
                        )}
                      </ListGroup>
                    </Tab.Pane>
                </Tab.Content>
              </Col>
            </Tab.Container>
          </Row>
        </Grid>
      )
    } else {
      if(window.location.pathname.slice(6) !== this.state.currentURL) this.updatecurrentUser();
      console.log('rendering user view page')
      return (
        <Grid>
          <Row className = "userView">
            <Col md={3}>
              <img
                height = "200px"
                width = "200px"
                alt="Avatar"
                src={this.state.currentUser.avatarURL}>
              </img>
              <br></br>
              <Panel header={<b>{this.state.currentUser.fullName}</b>} bsStyle="primary">
                {this.state.currentUser.username}
              </Panel>
              <Panel header="Website">
              {this.state.currentUser.website}
              </Panel>
              <Panel header="GitHub">
              {this.state.currentUser.githubURL}
              </Panel>
              <Panel header="Email Address">
              {this.state.currentUser.emailPublic}
              </Panel>
              <img src='http://s3.amazonaws.com/assets.brickworksoftware.com/lord_and_taylor/images/location.svg'/>{this.state.currentUser.location}
            </Col>
            <Tab.Container id="userViewTabs" defaultActiveKey="Lessons">
              <Col md={9}>
                <Nav bsStyle ="tabs" justified
                onSelect = {this.handleTabSelect}>
                  <NavItem eventKey="lessons" title="Lessons">Lessons</NavItem>
                  <NavItem eventKey="favorites" title="Favorites">Favorites</NavItem>
                </Nav>
                <Tab.Content animation>
                    <Tab.Pane eventKey="lessons">
                      <ListGroup>
                        {this.state.currentUserLessons.map((lesson, i) =>
                          <LessonPreview
                            lesson={lesson}
                            index={i}
                            key={i}
                          />
                        )}
                      </ListGroup>
                    </Tab.Pane>
                    <Tab.Pane eventKey="favorites">
                    <ListGroup bsStyle="danger">
                        {this.state.currentUserFavorites.map((lesson, i) =>
                          <LessonPreview
                            lesson={lesson}
                            index={i}
                            key={i}
                          />
                        )}
                      </ListGroup>
                    </Tab.Pane>
                </Tab.Content>
              </Col>
            </Tab.Container>
          </Row>
        </Grid>
      )
    }
  }
}

export default User;
