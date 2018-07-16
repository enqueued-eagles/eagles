import React from 'react';
import axios from 'axios';//use in functions
import {Link} from 'react-router-dom';
import SlideCreator from './SlideCreator.js';
import LessonInfo from './LessonInfo.js';
import LessonFieldEntry from './LessonFieldEntry.js';
import TagsEntry from './TagsEntry.js';
import ExistingSlides from './ExistingSlides.js';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

class LessonCreator extends React.Component {
  constructor (props) {
    super(props);
    let lessonInfo = this.props.location.lesson;
    this.state = {
      name: lessonInfo ? lessonInfo.name : '',
      userRef: lessonInfo ? lessonInfo.userRef : this.props.userRef,
      description: lessonInfo ? lessonInfo.description : '',
      slides: [],
      slidesId: [],
      creatingSlide: false,
      lessonId: lessonInfo ? lessonInfo._id : '',
      keywords: lessonInfo ? lessonInfo.keywords : [],
      displayedKeyword: 'enter tag here',
      editingOldSlide: lessonInfo ? lessonInfo.editingOldSlide : false,
      oldSlide: '',
      allLessons: ['none'],
      preReqLessons: lessonInfo ? lessonInfo.preReqLessons : [],
      value: ''
    };
  }

  componentDidMount() {
    if (this.props.location.lesson) {
      fetch('/api/slides', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      })
        .then(result => result.json())
        .then(slides => {
          slides = slides.filter(slide => slide.lessonRef === this.state.lessonId);
          this.setState({slides: slides.map(slide => slide.name), slidesId: slides.map(slide => slide._id)});
        })
        .catch(err => console.log('SLIDES DATABASE RETRIEVAL ERROR:', err));
    }
    this.props.getLessons()
      .then(lessons => {
        this.setState({
          allLessons: lessons
        })
      })
      .then(res => this.state.allLessons.unshift({name: 'none'}))
  }

  // submit new Lesson to the db and set the lesson to the lessonId state property
  onSubmit (event) {
    console.log('event.target', event.target);
    event.preventDefault();
    var lessonObj = {
      name: this.state.name,
      userRef: this.state.userRef,
      description: this.state.description,
      slides: this.state.slides
    };

    fetch('/api/lessons', {
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
          lessonId: result._id // setting lessonId to the lesson object's id
        })
        console.log('state now is ', this.state);
      });
  }

  submitEdit() {
    var lessonObj = {
      name: this.state.name,
      userRef: this.state.userRef,
      description: this.state.description,
      slides: this.state.slides,
      keywords: this.state.keywords,
      lessonId: this.state.lessonId
    };

    fetch('/api/lessons', {
      method: "PUT",
      body: JSON.stringify(lessonObj),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
      .then(anything => anything.json())
      .then(result => {
        console.log('Lesson update complete.');
      })
      .catch(err => console.log('Lesson update error:', err));
  }

  // gets index of slide, fetches the slide from the db
  // then sets the fetched slide in state and TOGGLE 'editingOldSlide' state
  seeOldSlide (slide) {
    console.log('this is the event after clicking ', slide);
    var indexOfSlideId = this.state.slides.indexOf(slide);
    var slideId = this.state.slidesId[indexOfSlideId];
    console.log('line 92:', slideId,indexOfSlideId);
    var url = '/api/slides/' + slideId;
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

  // looks like exact same function as above, just with toggling 'creatingSlide' as well
  seeOldSlideFromLesson (slide) {
    console.log('this is the event after clicking ', slide);
    var indexOfSlideId = this.state.slides.indexOf(slide);
    var slideId = this.state.slidesId[indexOfSlideId];
    console.log(slideId,indexOfSlideId);
    var url = '/api/slides/' + slideId;
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

  // amends the keywords associated with the current lesson in the db and sets it in state
  keywordSubmit (event) {
    console.log('this.state.displayedKeyword', this.state.displayedKeyword)
    event.preventDefault();
    console.log('keywordSubmit triggered keywords look like: ', this.state.displayedKeyword);
    var keywords = this.state.displayedKeyword.trim();
    var body = { keywords: [...this.state.keywords, keywords], lessonId: this.state.lessonId };
    this.setState({
      keywords: body.keywords,
      displayedKeyword: ''
    });
    console.log('body:', body);
    fetch('/api/lessons', {
      method: 'PUT',
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
  }

  preReqSubmit (event) {
    console.log('preReqsubmit triggered preReq looks like ', this.state.preReqLessons);
    var preReqLessons = this.state.preReqLessons;
    console.log('preReqLessons is currently..', preReqLessons)
    var body = {preReqLessons: this.state.preReqLessons, lessonId: this.state.lessonId};
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
    .then(function(result) {
      console.log('from lessoncreator result after preReq update is', result);
    })
    .catch(function(err) {
      console.log('line 164 err', err);
    })
  }

  changeKeywords(event, keywordIdx) {
    console.log('this.state.keywords:', this.state.keywords);
    console.log('keywordIdx', keywordIdx);
    console.log(this.state.keywords.slice(keywordIdx + 1));
    let keywords = [
      ...this.state.keywords.slice(0, keywordIdx),
      event.target.value,
      ...this.state.keywords.slice(keywordIdx + 1)
    ];
    console.log('keywords after splice:', keywords);
    this.setState({keywords});
  }

  changeDisplayedKeyword (event) {
    this.setState({
      displayedKeyword: event.target.value
    });
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

  removeKeyword (keywordIdx) {
    let keywords = [
      ...this.state.keywords.slice(0, keywordIdx),
      ...this.state.keywords.slice(keywordIdx + 1)
    ];
    this.setState({
      keywords
    });
    setTimeout(this.submitEdit.bind(this), 100);
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

  handlePreReq (lesson) {
    this.state.preReqLessons.push(lesson.target.value);
    this.setState({
      value: ''
    });
    this.preReqSubmit();
  }

  getNames () {
    let all = this.state.allLessons;
    let map = this.state.preReqLessons.map(item => {
      for (let i = 0; i < all.length; i++) {
        if (all[i]._id === item) {
          return all[i].name;
        }
      }
    });
    return map;
  }

  reset () {
    this.setState({
      name: '',
      userRef: this.props.userRef,
      description: '',
      slides: [],
      slidesId: [],
      creatingSlide: false,
      lessonId: '',
      keywords: [],
      displayedKeyword: '',
      editingOldSlide: false,
      oldSlide: ''
    });
  }

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
              <ControlLabel>
                <a style={{color: 'white'}}>
                  Lesson Editor
                </a>
              </ControlLabel>
            </div>
          </FormGroup>

          {
            this.state.lessonId ?
              <div>
                <LessonInfo
                  name={this.state.name}
                  description={this.state.description}
                  keywords={this.state.keywords}
                  getNames={this.getNames.bind(this)}
                  changeName={this.changeName.bind(this)}
                  changeDescription={this.changeDescription.bind(this)}
                  changeKeywords={this.changeKeywords.bind(this)}
                  removeKeyword={this.removeKeyword.bind(this)}
                  submitEdit={this.submitEdit.bind(this)}
                />
                <div>
                  <a style={{color:'white'}}>Recommend Prerequisites:</a><br/>
                  <Form>
                    <label>
                      <select value={this.state.value} onChange={this.handlePreReq.bind(this)}>
                        {this.state.allLessons.map((lesson, i) => (
                          <option value={lesson._id} key={i}>{lesson.name}</option>
                        ))}
                      </select>
                    </label>
                  </Form>
                </div><br/>
                <TagsEntry
                  keyword={this.state.displayedKeyword}
                  changeDisplayedKeyword={this.changeDisplayedKeyword.bind(this)}
                  keywordSubmit={this.keywordSubmit.bind(this)}
                />
              </div>
            :
              <div>
                <LessonFieldEntry
                  field={'Lesson Name'}
                  fieldValue={this.state.name}
                  changeValue={this.changeName.bind(this)}
                  style={{color: 'white'}}
                />
                <LessonFieldEntry
                  field={'Lesson Description'}
                  fieldValue={this.state.description}
                  changeValue={this.changeDescription.bind(this)}
                  style={{color: 'white'}}
                />
              </div>
          }<br/>

          <FormGroup>
            {
              this.state.lessonId === '' ?
                (<Col smOffset={1} sm={2}>
                  <Button
                    type="submit"
                    bsStyle="primary"
                    bsSize="small"
                  >Create Lesson</Button>
                </Col>)
              :
                (<Col smOffset={2} sm={1}>
                  <Button
                    type="submit"
                    onClick={this.changeCreateState.bind(this)}
                    bsStyle="primary"
                    bsSize="small"
                  >Slide Creator</Button>
                </Col>)
            }

            {this.state.lessonId === '' ? null :
              (<Col smOffset={1} sm={1}>
                <Button
                  type="button"
                  onClick={this.reset.bind(this)}
                  bsStyle="warning"
                  bsSize="small"
                >Create New Lesson</Button>
              </Col>)}

            {<Col smOffset={1} sm={1}>
                <Link to='/'>
                  <Button
                    type="button"
                    bsStyle="warning"
                    bsSize="small"
                  >Go Home</Button>
                </Link><br/><br/><br/>
              </Col>}
          </FormGroup>

          {
            this.state.slides.length ?
              <ExistingSlides
                slides={this.state.slides}
                creatingSlide={this.state.creatingSlide}
                seeOldSlide={this.seeOldSlide.bind(this)}
                seeOldSlideFromLesson={this.seeOldSlideFromLesson.bind(this)}
              />
            :
              <div className='existingSlides' style={{color: 'white'}} >No Slides Yet :(</div>
          }

        </Form>
      )
    } else {
      if (!this.state.editingOldSlide) {
        return (
          <div>
            <LessonInfo
              name={this.state.name}
              description={this.state.description}
              keywords={this.state.keywords}
              getNames={this.getNames.bind(this)}
              changeName={this.changeName.bind(this)}
              changeDescription={this.changeDescription.bind(this)}
              changeKeywords={this.changeKeywords.bind(this)}
              removeKeyword={this.removeKeyword.bind(this)}
              submitEdit={this.submitEdit.bind(this)}
            />
            <SlideCreator
              slide={{}}
              lessonRef={this.state.lessonId}
              fetch={this.fetchSlideFromSlideCreator.bind(this)}
              changeCreateState={this.changeCreateState.bind(this)}
              changeEditingOldSlide={this.changeEditingOldSlide.bind(this)}
            />
          </div>
        )
      } else {
        return (
          <div>
            <LessonInfo
              name={this.state.name}
              description={this.state.description}
              keywords={this.state.keywords}
              getNames={this.getNames.bind(this)}
              changeName={this.changeName.bind(this)}
              changeDescription={this.changeDescription.bind(this)}
              changeKeywords={this.changeKeywords.bind(this)}
              removeKeyword={this.removeKeyword.bind(this)}
              submitEdit={this.submitEdit.bind(this)}
            />
            <SlideCreator
              slide={this.state.oldSlide}
              lessonRef={this.state.lessonId}
              fetch={this.fetchSlideFromSlideCreator.bind(this)}
              changeCreateState={this.changeCreateState.bind(this)}
              changeEditingOldSlide={this.changeEditingOldSlide.bind(this)}
            />
          </div>
        )
      }
    }
  }
}

export default LessonCreator;
