import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem, Header, Button } from 'react-bootstrap';
import { ListGroup, DropdownButton, ButtonGroup, MenuItem } from 'react-bootstrap';
import { Grid, Row, Col, Nav, NavItem, Form, FormControl, FormGroup, ControlLabel, Tab, FieldGroup, OverlayTrigger  } from 'react-bootstrap';
import LessonPreviewContainer from './Lesson/LessonPreviewContainer';
import LessonPreview from './Lesson/LessonPreview';
import axios from 'axios';


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.user, 
      lessons: [],
      favoriteLessons: []
    }
    this.deleteLesson = this.deleteLesson.bind(this);
    this.changeAvatarURL = this.changeAvatarURL.bind(this)
    this.render = this.render.bind(this)
    this.submitOverview = this.submitOverview.bind(this)
  }

  componentDidMount() {
    axios.get(`/user/${this.props.user._id}`)
    .then((user) => {
      console.log('newuser',user)
      this.setState({currentUser:user.data[0]})
      this.render()
    })
    this.props.getLessons()
    .then((unfilteredLessons) => {
      console.log('not filtered: ', unfilteredLessons);
      return {
        lessons: unfilteredLessons.filter(lsn => this.props.user._id === lsn.userRef),
        favoriteLessons: unfilteredLessons.filter(lsn => lsn.userLikes.indexOf(this.props.user.username) >= 0)
      }
    })
    .then((lesson) => this.setState({lessons: lesson.lessons, favoriteLessons: lesson.favoriteLessons}))
    .catch((err) => console.log('Error! ', err));
  }

  deleteLesson(lessonId) {
    return fetch('/lessons/' + lessonId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then((deletedlesson) => {
      let newState = this.state.lessons.filter(lesson => lesson._id !== lessonId)
      console.log('new state: ', newState);
      this.setState({lessons: newState});
    })
    .catch((err) => console.log('Error deleting lessons', err));
  }

  changeAvatarURL(e) {
    e.preventDefault();
    console.log('doc.val', document.getElementById("avatarURL").value)
    let data = {};
    data.userId = this.props.user._id
    console.log(data.userId)
    data.avatarURL = document.getElementById("avatarURL").value
    axios.put('/user', {'data':data})
    .then( (res) => {
      console.log('axios.put win', res)
      axios.get(`/user/${this.props.user._id}`)
      .then((user) => {
        console.log('newuser',user)
        this.setState({currentUser:user.data[0]})
        this.render()
      })
    })
    .catch( (err) => console.log('changeAvatarURL axios err', err) )
  }

  submitOverview(e){
    e.preventDefault();
    let data={};
    data.userId = this.props.user._id
    data.fullName = document.getElementById("fullName").value
    data.location = document.getElementById("location").value
    data.website = document.getElementById("website").value
    data.githubURL = document.getElementById("githubURL").value
    data.emailPublic = document.getElementById("emailPublic").value
    data.emailLikeGoal = document.getElementById("emailLikeGoal").value
    axios.put('/user',{'data':data})
    .then( (res) => {
      console.log('axios.put2 win', res)
      axios.get(`/user/${this.props.user._id}`)
      .then((user) => {
        console.log('newuser',user)
        this.setState({currentUser:user.data[0]})
        alert('Saved! Refresh to view')
      })
    })
    .catch( (err) => console.log('submitOverview axios err', err) )
  }


  render() {
    console.log('user prop', this.props.user)
    console.log('this.state.currentUser', this.state)
    if(this.props.user.username === window.location.pathname.slice(6)){
      return (
        <Grid>
          <Row className = "userEdit">
            <Col md={3}>
              <img
                height = "200px"
                width = "200px"
                alt="Avatar"
                src={this.state.currentUser.avatarURL}>
              </img>
              <br></br>
              <Form inline onSubmit={this.changeAvatarURL}>
                <FormGroup controlId="avatarURL" >
                  <ControlLabel> Avatar URL:</ControlLabel>
                  <FormControl 
                  id="avatarURL" 
                  type="text" 
                  placeholder={this.state.currentUser.avatarURL}/>
                </FormGroup>
                <Button type="submit">Change</Button>
              </Form>
            </Col>
            
            <Tab.Container id="userEditTabs" defaultActiveKey="overview">
              <Col md={9}>
                <Nav bsStyle ="tabs" justified  
                onSelect = {this.handleTabSelect}>
                  <NavItem eventKey="overview" title="Overview">Overview</NavItem>
                  <NavItem eventKey="lessons" title="Lessons">Lessons</NavItem>
                  <NavItem eventKey="favorites" title="Favorites">Favorties</NavItem>
                </Nav>
                <Tab.Content animation>
                    <Tab.Pane eventKey="overview">
                      <Form onSubmit={this.submitOverview}>
                        <FormGroup >
                          <ControlLabel> Full Name:</ControlLabel>
                          <FormControl 
                          id="fullName" 
                          type="text" 
                          placeholder={this.state.currentUser.fullName || "What's your name?"}/>
                        </FormGroup>
                        <FormGroup >
                          <ControlLabel> Location:</ControlLabel>
                          <FormControl 
                          id="location" 
                          type="text" 
                          placeholder={this.state.currentUser.location || "Where are you located?"}/>
                        </FormGroup>
                        <FormGroup >
                          <ControlLabel> Website:</ControlLabel>
                          <FormControl 
                          id="website" 
                          type="text" 
                          placeholder={this.state.currentUser.website || "Do you have a website?"}/>
                        </FormGroup>
                        <FormGroup >
                          <ControlLabel> Public E-mail Address:</ControlLabel>
                          <FormControl 
                          id="emailPublic" 
                          type="text" 
                          placeholder={this.state.currentUser.emailPublic || "Where do you want the public to email you?"}/>
                        </FormGroup>
                        <FormGroup >
                          <ControlLabel> Github:</ControlLabel>
                          <FormControl 
                          id="githubURL" 
                          type="text" 
                          placeholder={this.state.currentUser.githubURL || "What's your GitHub Account?"}/>
                        </FormGroup>
                        <FormGroup >
                          <ControlLabel> Email me every x likes:</ControlLabel>
                          <FormControl 
                          id="emailLikeGoal" 
                          type="text" 
                          placeholder={this.state.currentUser.emailLikeGoal || "x"}/>
                        </FormGroup>
                        <Button type="submit">
                          Save
                        </Button>
                      </Form>
                    </Tab.Pane>
                    <Tab.Pane eventKey="lessons">
                      <ListGroup>
                        {this.state.lessons.map((lesson, i) =>
                          <LessonPreview
                            lesson={lesson}
                            index={i}
                            key={i}
                          />
                        )}
                      </ListGroup>
                    </Tab.Pane>
                    <Tab.Pane eventKey="favorites">
                    <ListGroup>
                        {this.state.favoriteLessons.map((lesson, i) =>
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
    else {
      return (
        <ListGroup>
          <ListGroupItem>Username: { this.props.user.username || 'no username!' }</ListGroupItem>
          <ListGroupItem>
            <ButtonGroup vertical block>
              <DropdownButton title="Your Favorite Lessons:" id="Your Favorite Lesson">
                <MenuItem key={ this.props.user._id + 1 }>
                  { this.state.favoriteLessons.length === 0 ? 'You Have No Favorite Lessons!' :
                    (this.state.favoriteLessons.map((lesson, i) => 
                      <div key={ lesson._id }>
                      Lesson Name: {lesson.name || 'Unnamed Lesson'} 
                      <br/>
                      Lesson Description: {lesson.description || 'no description'} 
                      <Link to={'/lesson/' + lesson._id}>
                        <Button bsStyle="primary" bsSize="small" block>View Lesson</Button>
                      </Link>
                      </div>
                    )
                  )}
                </MenuItem> 
              </DropdownButton>
            </ButtonGroup>
          </ListGroupItem>
          <ListGroupItem>
            <ButtonGroup vertical block>
              <DropdownButton title="Your Lessons:" id="Your Lessons">
                <MenuItem key={ this.props.user._id }>
                  { this.state.lessons.length === 0 ? 'You Have No Lessons!' :
                    (this.state.lessons.map((lesson, i) => 
                      <div key={ lesson._id }>
                      Lesson Name: {lesson.name || 'Unnamed Lesson'}
                      <br/>
                      Lesson Description: {lesson.description || 'no description'} 
                      <Link to={'/lesson/' + lesson._id}>
                        <Button bsStyle="primary" bsSize="small" block>View Lesson</Button>
                      </Link>
                      <Button bsStyle="primary" bsSize="small" onClick={ () => this.deleteLesson(lesson._id) } block>Delete Lesson</Button>
                      </div>
                    )
                  )}
                </MenuItem> 
              </DropdownButton>
            </ButtonGroup>
          </ListGroupItem>
        </ListGroup>
      );
    }
  } 
}

export default User;
// {this.state.lessons.length > 0 ? (<LessonPreviewContainer lessons={ this.state.lessons }/>) : '' }