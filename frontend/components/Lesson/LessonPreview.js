import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem, Header, Button } from 'react-bootstrap';

class LessonPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creator: ''
    }
  }

  componentDidMount() {
    this.props.getUsers().then(users => {
      for (let i = 0; i < users.length; i++) {
        if (users[i]._id === this.props.lesson.userRef) {
          this.setState({
            creator: users[i].username
          })
          break;
        }
      })
    }
  }

  render() {
    return (
        <div className="LessonPreview">
          <ListGroupItem header={this.props.lesson.name || 'no name'}>
            <br />
            {this.props.lesson.description || 'no description'}
            <br />
            <br />
            Creator: {this.state.creator}
            <br />
            <Link to={'/lesson/' + this.props.lesson._id}>
            <Button bsStyle="primary" bsSize="small" >View Lesson</Button>
          </Link>
        </ListGroupItem>
      </div>
    )
  }
}

export default LessonPreview;
