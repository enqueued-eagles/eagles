import React from 'react';
import axios from 'axios';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button } from 'react-bootstrap';

class SlideCreator extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      name: props.slide.name || '',
      youTubeUrl: props.slide.youTubeUrl || '',
      youTubeThumbnailUrl: props.slide.youTubeThumbnailUrl || '',
      youTubeTags: props.slide.youTubeTags || '',
      text: props.slide.text || '',
      quizUrl: props.slide.quizUrl || '',
      old: props.slide.old || '',
      lessonRef: props.lessonRef
    }
  }
  reset () {
    this.setState({
      name: '',
      youTubeUrl: '',
      youTubeThumbnailUrl: '',
      youTubeTags: '',
      text: '',
      quizUrl: '',  
    });
  }
  onSubmit (event) {
    console.log('is this working?');
    event.preventDefault();
    if (this.state.name !== '') {
      if (this.state.youTubeUrl !== '') {
        if (this.state.youTubeUrl.includes('https://www.youtube.com/watch?v=')) {
          var sliceFrom = this.state.youTubeUrl.indexOf('=');
          var youTubeUrl = this.state.youTubeUrl.slice(sliceFrom + 1);
          this.youTubeQueryToServer(youTubeUrl, (youTubeDataObj) => {
            this.setState({
              youTubeThumbnailUrl: youTubeDataObj.snippet.thumbnails.default.url,
              youTubeTags: youTubeDataObj.snippet.tags
            })
            // youtubeDataObj.id;
            // youTubeDataObj.snippet.title
            fetch('/api/slides', {
              method: "POST",
              body: JSON.stringify(this.state),
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include"
            })
            .then((something) => something.json())
            .then(result => {
              console.log(result, ' that was result this.state is', this.state);
              this.props.fetch(result);
              this.reset();  
            })
          });
        } else {
          alert('Incorrect YouTube URL input! Please revise Youtube URL input');
          this.setState({
            youTubeUrl: ''
          });
        }
      } else {
        fetch('/api/slides', {
          method: "POST",
          body: JSON.stringify(this.state),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        })
        .then((something) => something.json())
        .then(result => {
          console.log('NOTICE ME AAAAAAAAAAAAAAAAAA');
          console.log(result, ' that was result this.state is', this.state);
          this.props.fetch(result);
          this.reset();
        })
        .catch(err => console.log('onSubmit ERROR:', err));
      }
    } else {
        alert('Slide name required. Please enter a slide name.');
    }
  }

  updateOldSlide () {
    var id = this.props.slide._id;
    var body = this.state;
    body.id = id;
    fetch('/api/slides',{
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })    
    .then(function(result) {
      return result.json();
    })
    .then(function(result) {
      console.log('from line111 slidecreator result after update is', result);
    })
    .catch(function(err) {
      console.log('line 114 err', err);
    })
  }

  youTubeQueryToServer(searchString, cb) {
    fetch('/api/query?string=' + searchString, {
      method: "GET",
       headers: {
          "Content-Type": "application/json",
        },
      credentials: "include"
    })
    .then((something) => something.json())
    .then((result) => {
      console.log('Youtube query sent to server', result[0]);
      cb(result[0]);
    })
    .catch((err) => {
      console.log('Error: youtube query not sent to server', err);
    })
  }

  render () {
    return (
      <Form horizontal onSubmit={this.onSubmit.bind(this)}>
        <FormGroup>
          <div className='slideCreator'>
            <ControlLabel>Slide Creator</ControlLabel>
          </div>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Slide Name</Col>
          <Col sm={10}>
            <FormControl type='text' placeholder='Slide Name'
              value={this.state.name}
              onChange={(event) => this.setState({name: event.target.value})}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Slide youTubeUrl</Col>
          <Col sm={10}>
            <FormControl type='text' placeholder='Slide youTube Url'
              value={this.state.youTubeUrl}
              onChange={(event) => this.setState({youTubeUrl: event.target.value})}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Slide Text</Col>
          <Col sm={10}>
            <FormControl type='text' placeholder='Slide Text'
              value={this.state.text}
              onChange={(event) => this.setState({text: event.target.value})}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Slide QuizUrl</Col>
          <Col sm={10}>
            <FormControl type='Quiz Url' placeholder='Quiz Url'
              value={this.state.quizUrl}
              onChange={(event) => this.setState({quizUrl: event.target.value})}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          {
            this.state.old === '' ?
            <div>
              <Col smOffset={2} sm={2}>
                <Button type="submit" bsStyle="primary" bsSize="small">
                  Create Slide
                </Button>
              </Col>
              <Col>
                <Button onClick={this.props.changeCreateState} bsStyle="warning" bsSize="small">
                  Go Back
                </Button>
              </Col>
            </div>
          :
            <Col smOffset={2} sm={2}>
              <Button onClick={() => {
                this.updateOldSlide();
                this.props.changeEditingOldSlide();
              }} bsStyle="primary" bsSize="small">
                Finish Updates
              </Button>
            </Col>
          }
        </FormGroup>
      </Form>
    );
  }

}


export default SlideCreator;