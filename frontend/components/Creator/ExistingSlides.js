import React from 'react';
import { Button } from 'react-bootstrap';

class ExistingSlides extends React.Component {
  render() {
    return (
      <div>
        Existing Slides<br/> 
        {this.props.slides.map((slide, i) => {
          return (
            <Button
              key={i} 
              bsStyle="info" 
              bsSize="small"
              onClick={() => {
                this.props.creatingSlide ? this.props.seeOldSlide(slide) : this.props.seeOldSlideFromLesson(slide);
              }}
            >
              {slide}
            </Button>
          )
        })}
      </div>
    )
  }
}

export default ExistingSlides;