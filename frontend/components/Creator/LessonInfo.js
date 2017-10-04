import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class LessonInfo extends React.Component {
  render() {
    return (
      <ListGroup>
        <ListGroupItem>Lesson Name: {this.props.name}</ListGroupItem>
        <ListGroupItem>Lesson Description: {this.props.description}</ListGroupItem>
        <ListGroupItem>Lesson Tags: {this.props.keyWords.join(', ')}</ListGroupItem>
      </ListGroup>
    )
  }
}

export default LessonInfo;