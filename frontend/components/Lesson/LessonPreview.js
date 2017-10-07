import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem, Header, Button, Image, Grid, Row, Thumbnail } from 'react-bootstrap';
import axios from 'axios';
import LessonSlideListEntry from './LessonSlideListEntry.js';
import Thumb from './Thumb'

class LessonPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creator: '',
      slideName: '',
      numSlides: 0
    }
    // console.log('PROPS.LESSON:', props.lesson);
    this.getUsername = this.getUsername.bind(this)
    this.getSlideUrl = this.getSlideUrl.bind(this)
  }

  componentDidMount() {
    this.getUsername()
  }

  getUsername () {
    axios.get(`/api/user/${this.props.lesson.userRef}`)
    .then( (user) => {
      // console.log('newuser',user)
      // console.log(1,this.props.sessionUserId)
      // console.log(2,this.props.lesson.userRef)
      // console.log(user.data[0].username)
      this.setState({
        creator:user.data[0].username
      })
    })
  }


  getSlideUrl() {
    this.setState({
      numSlides: this.state.numSlides++
    })
  }


  render() {
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
              </span>
            </div>
            <br></br>
        </ListGroupItem>
      </div>
    )
  }
}


export default LessonPreview;
