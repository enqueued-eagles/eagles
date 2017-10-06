import React from 'react';
import { ListGroup, ListGroupItem, Form, FormControl } from 'react-bootstrap';

class LessonInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingName: false,
      editingDescription: false
    }
  }

  toggleEditingName() {
    this.setState({editingName: !this.state.editingName});
  }

  toggleEditingDescription() {
    this.setState({editingDescription: !this.state.editingDescription});
  }

  render() {
    return (
      <ListGroup>
          {
            this.state.editingName ?
            <Form onSubmit={() => {
              this.toggleEditingName();
              this.props.onSubmit();
            }}>
              <ListGroupItem>Lesson Name:<FormControl
                type='text'
                value={this.props.name}
                onChange={this.props.changeName}
              /></ListGroupItem>
            </Form>
          :
            <ListGroupItem onClick={this.toggleEditingName.bind(this)}>Lesson Name: {this.props.name}</ListGroupItem>
          }
          {
            this.state.editingDescription ?
            <Form onSubmit={() => {
                this.toggleEditingDescription();
                this.props.onSubmit();
              }}>
              <ListGroupItem>Lesson Description:<FormControl
                type='text'
                value={this.props.description}
                onChange={this.props.changeDescription}
                /></ListGroupItem>
            </Form>
          :
            <ListGroupItem onClick={this.toggleEditingDescription.bind(this)}>Lesson Description: {this.props.description}</ListGroupItem>
          }
        <ListGroupItem>Lesson Tags: {this.props.keywords.join(', ')}</ListGroupItem>
        <ListGroupItem>PreReq Lessons: {this.props.getNames().join(', ')}</ListGroupItem>
      </ListGroup>
    )
  }
}

export default LessonInfo;