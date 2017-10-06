import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem, Header, Button } from 'react-bootstrap';
import axios from 'axios'

class LessonPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creator: ''
    }
    console.log('PROPS.LESSON:', props.lesson);
    this.getUsername = this.getUsername.bind(this)
  }

  componentDidMount() {
    this.getUsername()
  }

  getUsername () {
    axios.get(`/api/user/${this.props.lesson.userRef}`)
    .then( (user) => {
      console.log('newuser',user)
      console.log(1,this.props.sessionUserId)
      console.log(2,this.props.lesson.userRef)
      console.log(user.data[0].username)
      this.setState({
        creator:user.data[0].username
      })
    })
  }

  render() {
    return (
        <div className="LessonPreview">
          <ListGroupItem header={this.props.lesson.name || 'no name'}>
            <br />
            {this.props.lesson.description || 'no description'}
            <br />
            <br />
            <b>Creator:</b> {this.state.creator}
            <br />
            <Link to={'/lesson/' + this.props.lesson._id}>
              <Button bsStyle="primary" bsSize="small" >View Lesson</Button>
            </Link>{` `}
            <Link to={'/user/' + this.state.creator}>
              <Button bsSize="small">Creator's Profile</Button>
            </Link>{' '}
            {
              this.props.sessionUserId === this.props.lesson.userRef ?
              <Link to={{
                pathname: '/create',
                lesson: this.props.lesson,
                editingOldSlide: true
              }}>
                <Button type="button" bsStyle="primary" bsSize="small">Edit Lesson</Button>
              </Link>
              : null
            }
        </ListGroupItem>
      </div>
    )
  }
}

export default LessonPreview;
