import React from 'react';
import { ListGroup, ListGroupItem, Form, FormControl, Button, Image } from 'react-bootstrap';

class LessonInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingName: false,
      editingDescription: false,
      editingKeywordBools: props.keywords.map(keyword => false)
    }
  }

  toggleEditingName() {
    this.setState({editingName: !this.state.editingName});
  }

  toggleEditingDescription() {
    this.setState({editingDescription: !this.state.editingDescription});
  }

  toggleEditingKeyword(keywordIndex) {
    let editingKeywordBools = this.state.editingKeywordBools.map((bool, i) => {
      if (i === keywordIndex) return !bool;
      else return bool;
    });
    this.setState({editingKeywordBools});
  }

  render() {
    return (
      <ListGroup>
          {
            this.state.editingName ?
            <Form onSubmit={() => {
              this.toggleEditingName();
              this.props.submitEdit();
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
                this.props.submitEdit();
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
        <ListGroupItem>Lesson Tags: {
          this.props.keywords.map((keyword, i) => {
            if (this.state.editingKeywordBools[i]) {
              console.log('line 67 i:', i);
              return (
                <Form key={i} onSubmit={() => {
                  this.toggleEditingKeyword(i);
                  this.props.submitEdit();
                }}>
                  <FormControl
                    type='text'
                    value={keyword}
                    onChange={(e) => {
                      this.props.changeKeywords(e, i);
                    }}
                  />
                </Form>
              )
            } else {
              return (
                <Button
                  key={i}
                  bsStyle="info"
                  bsSize="small"
                >
                  <span key={i} onClick={this.toggleEditingKeyword.bind(this, i)}>
                    {`${keyword} `}
                  </span>
                  <span onClick={this.props.removeKeyword.bind(null, i)}>
                    <Image src="assets/delete.png" width="10" height="10" />
                  </span>
                </Button>
              )
            }
          })
        }</ListGroupItem>
        <ListGroupItem style={{color: 'white'}}>Recommended Prerequisites: {this.props.getNames().join(', ')}</ListGroupItem>
      </ListGroup>
    )
  }
}

export default LessonInfo;
