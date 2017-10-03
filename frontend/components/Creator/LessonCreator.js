import React from 'react';
import axios from 'axios';//use in functions
import {Link} from 'react-router-dom';
import SlideCreator from './SlideCreator.js';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

class LessonCreator extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      name: '',
      userRef: this.props.userRef,
      description: '',
      slides: [],
      slidesId: [],
      creatingSlide: false,
      lessonid: 'No ID Yet',
      keyWords: [],
      clientShownKeyWords: '',
      editingOldSlide: false,
      oldSlide: '',
      allLessons: [],
      preReqLessons: []
    };
  }
  componentDidMount() {
    this.props.getLessons().then(lessons => {
      this.setState({
        allLessons: lessons
      })
    })

  }


  onSubmit (event) {
    event.preventDefault();
    var lessonObj = {
      name: this.state.name,
      userRef: this.state.userRef,
      description: this.state.description,
      slides: this.state.slides

    };

    fetch('/lessons', {
      method: "POST",
      body: JSON.stringify(lessonObj),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then((anything) => anything.json())
    .then((result) => {
      console.log('result is',result);
      this.setState({
        lessonid: result._id // setting lessonid to the lesson object's id
      })
      console.log('state now is ', this.state);
    })
  }
  seeOldSlide (slide) {
    console.log('this is the event after clicking ', slide);
    var indexOfSlideId = this.state.slides.indexOf(slide);
    var slideId = this.state.slidesId[indexOfSlideId];
    console.log(slideId,indexOfSlideId);
    var url = '/slides/' + slideId;
    fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then(result => result.json())
    .then((result) => {
      console.log('result of retrieving slide by id',result[0])
      var oldSlide = result[0];
      oldSlide.old = true;
      this.setState({
        oldSlide: oldSlide,
        editingOldSlide: !this.state.editingOldSlide
      });
    });
  }
  seeOldSlideFromLesson (slide) {
    console.log('this is the event after clicking ', slide);
    var indexOfSlideId = this.state.slides.indexOf(slide);
    var slideId = this.state.slidesId[indexOfSlideId];
    console.log(slideId,indexOfSlideId);
    var url = '/slides/' + slideId;
    fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then(result => result.json())
    .then((result) => {
      console.log('result of retrieving slide by id',result[0])
      var oldSlide = result[0];
      oldSlide.old = true;
      this.setState({
        oldSlide: oldSlide,
        editingOldSlide: !this.state.editingOldSlide,
        creatingSlide: !this.state.creatingSlide
      });
    });
  }
  keyWordSubmit (event) {
    console.log('keyWordSubmit triggered keyWords look like ', this.state.clientShownKeyWords);
    var keyWords = this.state.clientShownKeyWords.trim();
    console.log('keyWords is currently..', keyWords)
    this.state.keyWords.push(keyWords)
    this.setState({
      clientShownKeyWords: ''
    })
    var body = { keyWords: this.state.keyWords, lessonid: this.state.lessonid };
    fetch('/lessons', {
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
    .then(function(result) {
      console.log('from line62 lessoncreator result after keyword update is', result);
    })
    .catch(function(err) {
      console.log('line 70 err', err);
    })
    event.preventDefault();
  }
  changeClientKeyWords (event) {
    var keyWords = event.target.value;
    this.setState({
      clientShownKeyWords: keyWords
    })
  }
  changeName (event) {
    this.setState({
      name: event.target.value
    });
  }

  changeDescription (event) {
    this.setState({
      description: event.target.value
    });
  }

  changeCreateState (event) {
    console.log('changingcreatestate')
    this.setState({
      creatingSlide: !this.state.creatingSlide
    })
  }
  changeEditingOldSlide (event) {
    console.log('changeEditingOldSlide')
    this.setState({
      creatingSlide: !this.state.creatingSlide,
      editingOldSlide: !this.state.editingOldSlide
    });
  }
  reset () {
    this.setState({
      name: '',
      userRef: this.props.userRef,
      description: '',
      slides: [],
      slidesId: [],
      creatingSlide: false,
      lessonid: 'No ID Yet',
      keyWords: [],
      clientShownKeyWords: '',
      editingOldSlide: false,
      oldSlide: ''
    });
  }

  handlePreReq (lesson) {
    console.log(lesson)
    // let a = (e.target.value)
    // console.log(a)
    // this.state.preReqLessons.push(JSON.parse(e.target.value));
    this.setState({
      preReqLessons: this.state.preReqLessons
    })
    // console.log(this.state.preReqLessons)
  }
  // goHome (event) {
  //   fetch('/',{
  //     method: "GET",
  //     headers: {
  //       "Content-Type":"application/json"
  //     },
  //     credentials: "include"
  //   })
  // }
  fetchSlideFromSlideCreator (result) {
    console.log(result);
    var slideName = result.name;
    var slideId = result._id;
    console.log('this is the result line119 lessoncreator', result);
    this.setState({
      slides: this.state.slides.concat(slideName), //pushing in slide object's id into slides;
      slidesId: this.state.slidesId.concat(slideId)
    })
  }
  render () {
    if (!this.state.creatingSlide) {
      return (
        <Form horizontal onSubmit={this.onSubmit.bind(this)}>
          <FormGroup>
            <div className='lessonCreator'>
              <ControlLabel>Lesson Creator</ControlLabel>
            </div>
          </FormGroup>

          { this.state.lessonid === 'No ID Yet' ? null :
            (<ListGroup>
              <ListGroupItem>Lesson Name: {this.state.name}</ListGroupItem>
              <ListGroupItem>Lesson Description: {this.state.description}</ListGroupItem>
              <ListGroupItem>Lesson Tags: {this.state.keyWords.join(', ')}</ListGroupItem>
              <ListGroupItem>PreReq Lessons: {this.state.preReqLessons.map(item => item.name).join(', ')}</ListGroupItem>
            </ListGroup>)
          }

          { this.state.lessonid === 'No ID Yet' ? (<FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Lesson Name</Col>
            <Col sm={10}>
              <FormControl type='text' placeholder='Lesson Name'
                value={this.state.name}
                onChange={this.changeName.bind(this)}
              />
            </Col>
          </FormGroup>) : null }

          { this.state.lessonid === 'No ID Yet' ? (<FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Lesson description</Col>
            <Col sm={10}>
              <FormControl type='text' placeholder='Lesson Description'
                value={this.state.description}
                onChange={this.changeDescription.bind(this)}
              />
            </Col>
          </FormGroup>) : null }


          {this.state.lessonid === 'No ID Yet' ? null : <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Add Tags To Lesson</Col>
            <Col sm={10}>
                <FormControl type='text'
                  value={this.state.clientShownKeyWords}
                  onChange={this.changeClientKeyWords.bind(this)}
                />
                <Button onClick={this.keyWordSubmit.bind(this)}
                  bsStyle="info"
                  bsSize="small"> Set Tags </Button>
            </Col>
          </FormGroup>}


          {/* ------------------- ADDED BY JON ---------------------*/}
          { this.state.lessonid === 'No ID Yet' ? null : (
            <div>
              Recommend Pre Requsites
              <select onChange={this.handlePreReq.bind(this)}>
                {this.state.allLessons.map((lesson, i) => (
                  <option value={lesson} key={i}>{lesson.name}</option>
                ))}
              </select>
              <br></br>
            </div>
          )}


          <FormGroup>
            {
              this.state.lessonid === 'No ID Yet' ?
              (<Col smOffset={1} sm={1}>
                <Button type="submit" bsStyle="primary" bsSize="small">
                  Make Lesson
                </Button>
              </Col>) :
              (<Col smOffset={1} sm={1}>
                <Button
                onClick={this.changeCreateState.bind(this)}
                bsStyle="primary"
                bsSize="small">Go To Slide Creator</Button>
              </Col>)
            }
            {this.state.lessonid === 'No ID Yet' ? null :
              (<Col smOffset={1} sm={1}>
                <Button type="button"
                  onClick={this.reset.bind(this)}
                  bsStyle="warning"
                  bsSize="small">Make New Lesson</Button>
              </Col>)
            }
            {
              <Col smOffset={1} sm={1}>
                <Link to='/'>
                  <Button type="button" bsStyle="warning" bsSize="small">Go Home</Button>
                </Link>
              </Col>
            }
          </FormGroup>
          {
            this.state.slides.length === 0 ?
            (<div>No Slides Yet</div>)
            :
            (<div>Lesson Slides:
              {
                this.state.slides.map((slide,i) => {
                  return <Button key={i}
                  onClick={this.seeOldSlideFromLesson.bind(this,slide)}
                  bsStyle="info"
                  bsSize="small">
                  {slide}
                  </Button>
                })
              }
            </div>)
          }
        </Form>
      )
    } else if (this.state.creatingSlide && !this.state.editingOldSlide) {
      return (
        <div>
          <ListGroup>
            <ListGroupItem>Lesson Name: {this.state.name}</ListGroupItem>
            <ListGroupItem>Lesson Description: {this.state.description}</ListGroupItem>
            <ListGroupItem>Lesson Tags: {this.state.keyWords.join(', ')}</ListGroupItem>
          </ListGroup>
          <SlideCreator
            slide={{}}
            lessonRef={this.state.lessonid}
            fetch={this.fetchSlideFromSlideCreator.bind(this)}
            changeCreateState={this.changeCreateState.bind(this)}
            changeEditingOldSlide={this.changeEditingOldSlide.bind(this)}>
          </SlideCreator>
          <div>Lesson Slides:
            {
              this.state.slides.map((slide,i) => {
                return <Button key={i}
                onClick={this.seeOldSlide.bind(this,slide)}
                bsStyle="info"
                bsSize="small">{slide}</Button>
              })
            }
          </div>
        </div>
      )
    } else if (this.state.creatingSlide && this.state.editingOldSlide) {
      return (
        <div>
          <ListGroup>
            <ListGroupItem>Editing An Old Slide</ListGroupItem>
            <ListGroupItem>Lesson Name: {this.state.name}</ListGroupItem>
            <ListGroupItem>Lesson Description: {this.state.description}</ListGroupItem>
            <ListGroupItem>Lesson Tags: {this.state.keyWords.join(', ')}</ListGroupItem>
          </ListGroup>
          <SlideCreator
            slide={this.state.oldSlide}
            lessonRef={this.state.lessonid}
            fetch={this.fetchSlideFromSlideCreator.bind(this)}
            changeCreateState={this.changeCreateState.bind(this)}
            changeEditingOldSlide={this.changeEditingOldSlide.bind(this)}>
          </SlideCreator>
        </div>
      )
    }
  }
}

export default LessonCreator;
