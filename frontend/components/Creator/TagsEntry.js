import React from 'react';
import { FormGroup, Col, FormControl, ControlLabel, Button } from 'react-bootstrap';

class TagsEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2} style={{color: 'white'}}>Add Tags To Lesson</Col>
        <Col sm={10}>
            <FormControl
              type='text'
              value={this.props.keywords}
              onChange={this.props.changeKeywords}
            />
            <Button
              onClick={this.props.keywordSubmit}
              bsStyle="info"
              bsSize="small"
            >Set Tags</Button>
        </Col>
      </FormGroup>
    )
  }
}

export default TagsEntry;
