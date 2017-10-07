import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem, Header, Button, Image, Grid, Row, Thumbnail, Alert } from 'react-bootstrap';
import axios from 'axios';
import LessonSlideListEntry from './LessonSlideListEntry.js';
import Thumb from './Thumb'

class LessonPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creator: '',
      deleteAlert: false,
      slideName: '',
      numSlides: 0
    }
    // console.log('PROPS.LESSON:', props.lesson);
    this.getUsername = this.getUsername.bind(this)
    this.handleAlertDismiss=this.handleAlertDismiss.bind(this)
    this.getSlideUrl = this.getSlideUrl.bind(this)
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

  getSlideUrl() {
    this.setState({
      numSlides: this.state.numSlides++
    })
  }

  render() {
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
          <ListGroupItem>
            <div>
              <a style={{color:'black', fontSize: 28, fontWeight: 'bold'}}>
                {this.props.lesson.name || 'no name'}
              </a>
              <span style={{float: 'right'}}>
                {
                  this.props.sessionUserId === this.props.lesson.userRef ?
                  <Link to={{
                    pathname: '/create',
                    lesson: this.props.lesson,
                    editingOldSlide: true
                  }}>
                    <Image src="https://image.flaticon.com/icons/png/512/7/7706.png" width="25" height="25"/>
                  </Link>
                  : null
                }
              </span>
            </div>
            <span style={{marginLeft: 15}}>{this.props.lesson.description || 'no description'}</span>
            <br />
            <br></br>
            {this.props.lesson.slides.map((slide, i) => {
              return (
                <Thumb
                  slide={slide}
                  key={i}
                  getSlideUrl={this.getSlideUrl}
                />
              )
            })}
            <br />
            <div style={{alignItems: 'center'}}>
              <b>Creator:</b> {this.state.creator}
              <span style={{float: 'right'}}>
                <Link to={'/lesson/' + this.props.lesson._id}>
                  <Button bsStyle="primary" bsSize="small" >View Lesson</Button>
                </Link>{` `}
                <Link to={'/user/' + this.state.creator}>
                  <Button bsSize="small">Creator's Profile</Button>
                </Link>{' '}
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
              </span>
            </div>
        </ListGroupItem>
      </div>
    )
  }
}


export default LessonPreview;
