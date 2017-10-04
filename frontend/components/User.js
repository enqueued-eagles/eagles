import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem, Header, Button } from 'react-bootstrap';
import { ListGroup, DropdownButton, ButtonGroup, MenuItem } from 'react-bootstrap';
import LessonPreviewContainer from './Lesson/LessonPreviewContainer';
import LessonPreview from './Lesson/LessonPreview';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lessons: [],
      favoriteLessons: []
    }
    this.deleteLesson = this.deleteLesson.bind(this);
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

  componentDidMount() {
 
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


  render() {
    console.log(this.props.user.username === window.location.pathname.slice(6))
    if(this.props.user.username === window.location.pathname.slice(6)){
      return (
        <div>HELLO DUDE</div>
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