import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem, Header, Button, Alert} from 'react-bootstrap';
import axios from 'axios'

class LessonPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creator: '',
      deleteAlert: false
    }
    console.log('PROPS.LESSON:', props.lesson);
    this.getUsername = this.getUsername.bind(this)
    this.handleAlertDismiss=this.handleAlertDismiss.bind(this)
  }

  componentDidMount() {
    this.getUsername()
  }

  getUsername () {
    axios.get(`/api/user/${this.props.lesson.userRef}`)
    .then( (user) => {
      this.setState({
        creator:user.data[0].username
      })
    })
  }

  handleAlertDismiss (){
    this.setState({
      deleteAlert:false
    })
  }

  render() {
    console.log('deletelessonprop', this.props.deleteLesson)
    if (this.state.deleteAlert) {
      return (
      <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
        <h4>Are you sure you want to delete your lesson?</h4>
        <p>Once you delete your lesson "{this.props.lesson.name}", it will be gone forever! Are you sure?</p>
        <p>
          <Button 
            bsStyle="danger" 
            onClick={ () => this.props.deleteLesson(this.props.lesson._id)} 
          >
          Delete it.
          </Button>
          <span> or </span>
          <Button onClick={this.handleAlertDismiss}>Go Back</Button>
        </p>
      </Alert>
      )
    }
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
            {' '}
            {
              this.props.deleteLesson ?
                <Button 
                  type="button" 
                  bsStyle="danger" 
                  bsSize="small" 
                  onClick={ () => this.setState({deleteAlert:true}) }>
                  Delete Lesson
                </Button>
              : null
            }
        </ListGroupItem>
      </div>
    )
  }
}

export default LessonPreview;
