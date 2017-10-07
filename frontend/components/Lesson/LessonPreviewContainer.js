import React, { Component } from 'react';
import LessonPreview from "./LessonPreview.js";
import { ListGroup, Button } from 'react-bootstrap';

class LessonPreviewContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getLessons();
  }

  render() {
    return (
      <div className="LessonPreviewContainer">
        <a style={{color: 'white'}}>
          Order by:
        </a>

        <Button bsStyle="primary" bsSize="small" onClick={this.props.organizeSearchResultsBasedOnMostLikes} >by Likes</Button>
        <Button bsStyle="primary" bsSize="small" >by Date</Button>
        <ListGroup>
        {this.props.lessons.map((lesson, i) =>
          <LessonPreview
            sessionUserId={this.props.sessionUserId}
            lesson={lesson}
            index={i}
            key={i}
            userRef={lesson.userRef}
            getUsers={this.props.getUsers}
          />
        )}
        </ListGroup>
      </div>
    )
  };
}


export default LessonPreviewContainer;
