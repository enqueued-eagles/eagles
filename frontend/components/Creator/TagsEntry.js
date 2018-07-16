import React from 'react';
import { FormGroup, Col, FormControl, ControlLabel, Button } from 'react-bootstrap';

class TagsEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className='tagsEntry' style={{color: 'white'}}>Add Tags To Lesson</div>
        <Col>
          <FormControl
            type='text'
            value={this.props.keyword}
            onChange={this.props.changeDisplayedKeyword}
          />
          <Button
            onClick={this.props.keywordSubmit}
            bsStyle="info"
            bsSize="small"
          >Add Tag</Button>
        </Col>
      </div>
    )
  }
}

export default TagsEntry;
