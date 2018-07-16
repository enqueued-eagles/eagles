import React from 'react';
import LessonSlideListEntry from './LessonSlideListEntry.js';
import Slide from './Slide.js';
import { Button, Grid, Row, Image, Modal } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Test from './test.js';
import LessonPreview from './LessonPreview'

class Lesson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      specificLesson: {},
      slides: [],
      currentSlide: null,
      index: 0,
      videoIdOfClickedOnVideo: '',
      liked: false,
      keywords: [],
      firstLike: false,
      relatedLessons: [],
      preReq: [],
      preReqLessons: [],
      postedToClass: false,
      lame: false,
      noPreviousSlideAlert:false,
      endOfLessonAlert:false,
      submittedAssignment: false
    }
    this.closeLame = this.closeLame.bind(this)
    this.closeendOfLessonAlert = this.closeendOfLessonAlert.bind(this)
    this.closenoPreviousSlideAlert = this.closenoPreviousSlideAlert.bind(this)
  }

  getUsers() {
    return fetch('/api/users/', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then((res) => res.json())
    .then((users) => {
      return users
    })
    .catch((err) => console.log('Error getting lessons', err));
  }

  componentWillReceiveProps(nextProps) {
    return nextProps.match.params.id !== this.props.match.params.id ? this.componentDidMount(nextProps.match.params.id) : null

    // return nextProps.match.params.id !== this.props.match.params.id ? true : false;
  }

  componentDidMount(id) {
    // console.log(this.props)
    id = id || this.props.match.params.id;
    console.log('fetching on lesson page');
    console.log('id', id)
    fetch('/api/lesson/' + id, { method: 'GET', credentials: "include" })
      .then((response) => {
        console.log('fetch returning')
        return response.json()
      })
      .then((lessonDataJSON) => {
        console.log('lessonDATAJSON', lessonDataJSON)
        this.setState({
          specificLesson: lessonDataJSON,
          slides: lessonDataJSON.slides,
          keywords: lessonDataJSON.keywords,
          preReq: lessonDataJSON.preReqLessons,
          preReqLessons: [],
          relatedLessons: [],
          submittedAssignment: false
        });
        console.log('speci lesson', this.state.specificLesson);
      })
      .then((res) => {
         fetch('/api/lessons', {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
           credentials: "include"
         })
         .then((res) => res.json())
         .then((lessons) => {
           this.state.keywords.forEach(keyword => {
             for (let i = 0; i < lessons.length; i++) {
               if (lessons[i].keywords.includes(keyword) && lessons[i]._id !== this.state.specificLesson._id && !this.state.relatedLessons.includes(lessons[i])) {
                 this.setState({
                   relatedLessons: [...this.state.relatedLessons, lessons[i]]
                 })
               }
             }
           })
           this.state.preReq.forEach(preReq => {
             for (let i = 0; i < lessons.length; i++) {
               if (lessons[i]._id === preReq) {
                 this.setState({
                   preReqLessons: [...this.state.preReqLessons, lessons[i]]
                 })
               }
             }
           })
           console.log('related lessons', this.state.relatedLessons)
         })
       })
  }

  onLessonSlideListEntryClick(index) {

    var videoIdInUrl = this.state.slides[index].youTubeUrl;
    var sliceFrom = videoIdInUrl.indexOf('=');
    var videoId = videoIdInUrl.slice(sliceFrom + 1);
    this.setState({
      currentSlide: this.state.slides[index],
      index: index,
      videoIdOfClickedOnVideo: videoId
    });
  }

  exit() {
    this.setState({
      currentSlide: '',
      index: ''
    });
  }

  closeLame() {
    this.setState({
      lame: false
    })
  }

  closeendOfLessonAlert () {
    this.setState({
      endOfLessonAlert: false
    })
    this.exit();
  }

  closenoPreviousSlideAlert () {
    this.setState({
      noPreviousSlideAlert: false
    })
    this.exit();
  }


  previousSlideClick(index) {
    index--;
    if (index < 0) {
      this.setState({
        noPreviousSlideAlert: true
      })
    } else {
      this.setState({
        index: index
      });
      this.onLessonSlideListEntryClick(index);
    }
  }

  nextSlideClick(index) {
    index++;
    if (index === this.state.slides.length) {
      this.setState({
        endOfLessonAlert:true
      })
    } else {
      this.setState({
        index: index
      });
      this.onLessonSlideListEntryClick(index);
    }
  }

  renderVideo(thereIsAVideo) {
    if (thereIsAVideo) {
      return <iframe style={{width: 500, height: 350, float: "left"}} className="youtubeVideo" src={'https://www.youtube.com/embed/' + thereIsAVideo} allowFullScreen></iframe>
    }
  }

  likeALesson() {
    this.state.specificLesson.likes++;
    var body = { likes: this.state.specificLesson.likes, lessonId: this.state.specificLesson._id, fromLike: true };
    fetch('/api/lessons', {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
    .then(function(result) {
      return result.json();
    })
    .then((likeCheck) => {
      if (this.state.specificLesson.likes - 1 === likeCheck.likes) {
        this.state.specificLesson.likes = likeCheck.likes;
        this.setState({
          liked: true
        })
      } else {
        this.setState({
          firstLike: true
        })
        console.log(this.state.specificLesson);
      }
    })
    .catch(function(err) {
      console.log(err);
    })
    if (this.props.sessionUserId == this.state.specificLesson.userRef){
      console.log(`ugh you're so lame`)
      this.setState({
        lame: true
      })
    }
  }

  postLessonToClassroom() {
    var lessonID = this.state.specificLesson._id

    var body = {
      title: this.state.specificLesson.name,
      description: this.state.specificLesson.description,
      link: `http://127.0.0.1:3000/lesson/${lessonID}`
    };

    fetch('/gclass/coursework', {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
    .then(results => {
      console.log('results', results)
      this.setState({
        postedToClass: true
      })
    })
    .catch(err => {console.log('error posting', err)})
  }

  submitAssignment() {
    var lessonID = this.state.specificLesson._id;
    var url = '/gclass/submissions/' + lessonID
    console.log('lesson', this.state.specificLesson)
    console.log('lessonID', lessonID)
    console.log('url', url)

    fetch(url, {
      method: "POST",
      body: {},
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
    .then(results => {
      console.log('results', results)
      this.setState({
        submittedAssignment: true
      })
    })
    .catch(err => {console.log('error posting', err)})

  }

  render() {
    return (
      <div>

        <Modal
          bsSize="small"
          show={this.state.lame}
          onHide={this.closeLame}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">What?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Can you like... not be such a loser? Who actually likes their own stuff? Ugh.
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeLame}>Close</Button>
          </Modal.Footer>
        </Modal>


        <Modal
          bsSize="small"
          show={this.state.noPreviousSlideAlert}
          onHide={this.closenoPreviousSlideAlert}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">No previous slide</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            There is no previous slide! You will be redirected to the Lesson Home Page.
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closenoPreviousSlideAlert}>Close</Button>
          </Modal.Footer>
        </Modal>


        <Modal
          bsSize="small"
          show={this.state.endOfLessonAlert}
          onHide={this.closeendOfLessonAlert}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">End of Lesson</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You've made it to the end of the lesson.
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeendOfLessonAlert}>Close</Button>
          </Modal.Footer>
        </Modal>

        { this.state.currentSlide ? (
          <Slide
          slideData={this.state.currentSlide}
          videoIdOfClickedOnVideo={this.state.videoIdOfClickedOnVideo}
          renderVideo={this.renderVideo(this.state.videoIdOfClickedOnVideo)}
          previousSlideClick={this.previousSlideClick.bind(this)}
          nextSlideClick={this.nextSlideClick.bind(this)}
          exitClick={this.exit.bind(this)}
          index={this.state.index}
          />
        ) : (


          <div className="lessonSlideList">
            <div className="lesson">
              <div>
                <b className="lessonTitle" style={{color:'white', fontSize:20}}>{this.state.specificLesson.name}</b>
                <span style={{float: 'right'}}>
                  {
                    this.props.sessionUserId === this.state.specificLesson.userRef ?
                      <Link to={{
                        pathname: '/create',
                        lesson: this.state.specificLesson,
                        editingOldSlide: true
                      }}>
                        <Image src="https://i.imgur.com/AnQW9ou.png" width="25" height="25" color="white"/>
                      </Link>
                    : null
                  }
                </span>
              </div>
              <p className="lessonDescription" style={{color:'white'}}>{this.state.specificLesson.description}</p>
              <p className="lessonKeyWords" style={{color:'white'}}> Keywords: {this.state.keywords.join(', ')}</p>
              <br></br>
              <div>
                <Grid style={{display: 'flex', justifyContent: 'center'}}>
                  <Row>
                    {this.state.slides.map((slide, i) => (
                      <LessonSlideListEntry
                        slide={slide}
                        index={i}
                        key={i}
                        onLessonSlideListEntryClick={this.onLessonSlideListEntryClick.bind(this)}
                      />
                    ))}
                  </Row>
                </Grid>
              </div>
            </div>
            <Button type="button" onClick={this.likeALesson.bind(this)}>
              <Image src="http://www.freeiconspng.com/uploads/like-button-png-2.png" width="15" height="15"/>
            </Button>
            {this.state.liked ? (
              <a> You liked this already! </a>
            ) : this.state.firstLike ? <a> You liked this! </a> : null}
            <br/>
            {!this.props.gUser ? (
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} href='/login/google'>
                <Image src="http://pngimg.com/uploads/google/google_PNG19635.png" width="50" height="50"/>
                <a href='/login/google' style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                   Log in to Google to post to classroom!
                </a>
              </div>
              ) : (
              !this.state.postedToClass ? (
                <Button type="button" onClick={this.postLessonToClassroom.bind(this)}>
                  <Image src="/assets/gclass.png" width="25" height="25"/>
                </Button>
              ) : (
                <span className="posted-message" style={{color:"white"}}>Posted to classroom!</span>

              )
            )}
          </div>
        )}

        <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'nowrap'}}>
          <Button bsStyle="" style={{backgroundColor: '#00D097', color: 'white', width: 250, boxSizing: 'none'}}
           onClick={this.submitAssignment.bind(this)}>
            Submit Assignment
          </Button>
        </div>

        <div className="relatedLessons">
          Recommended Prerequisite Lessons:
          {this.state.preReqLessons.map((lesson, i) => (
            <LessonPreview
              lesson={lesson}
              index={i}
              key={i}
              getUsers={this.getUsers.bind(this)}
            />
          ))}
        </div>

        <div className="relatedLessons" style={{color:'white'}}>
          Related Lessons:
          {this.state.relatedLessons.map((lesson, i) => (
            <LessonPreview
              lesson={lesson}
              index={i}
              key={i}
              getUsers={this.getUsers.bind(this)}
            />
          ))}
        </div><br/>
      </div>
    );
  }
}


export default Lesson;
