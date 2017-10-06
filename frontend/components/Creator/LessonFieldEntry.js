import React from 'react';
import { FormGroup, Col, FormControl, ControlLabel } from 'react-bootstrap';

class LessonFieldEntry extends React.Component {
  render() {
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2} style={{color: 'white'}}>{this.props.field}</Col>
        <Col sm={10}>
          <FormControl
            type='text'
            placeholder={this.props.field}
            value={this.props.fieldValue}
            onChange={this.props.changeValue}

          />
        </Col>
      </FormGroup>
    )
  }
}

export default LessonFieldEntry;
