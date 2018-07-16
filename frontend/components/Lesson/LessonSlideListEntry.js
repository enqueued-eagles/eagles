import React from 'react';
import { Thumbnail, Well, Col } from 'react-bootstrap';
import axios from 'axios';

const LessonSlideListEntry = (props) => {
    return !props.slide.youTubeThumbnailUrl ?
    (<Col xs={6} md={4}>
      <Well onClick={() => props.onLessonSlideListEntryClick(props.index)}>
        <h4 className="index"> {props.index + 1}</h4>
        <h4> {props.slide.name || 'No Slide Name'} </h4>
      </Well>
    </Col>)  :
    (<Col xs={6} md={4}>
      <Well>
        <Thumbnail src={props.slide.youTubeThumbnailUrl} alt="" onClick={() => props.onLessonSlideListEntryClick(props.index)}>
          <h4 className="index"> {props.index + 1}</h4>
          <h4> {props.slide.name || 'No Slide Name'} </h4>
        </Thumbnail>
      </Well>
    </Col>)
};


export default LessonSlideListEntry;
