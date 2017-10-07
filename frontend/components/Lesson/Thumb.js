import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import axios from 'axios';

class Thumb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnail: '',
      name: ''
    }

    this.getThumbnail = this.getThumbnail.bind(this);
  }

  componentDidMount() {
    this.getThumbnail();
  }

  getThumbnail() {
    axios.get(`/api/slides/${this.props.slide}`)
    .then(slide => {
      this.setState({
        thumbnail: slide.data[0].youTubeThumbnailUrl,
        name: slide.data[0].name
      })
    })
    .then(res => {
      console.log(this.state.thumbnail)
      this.props.getSlideUrl()
    })
    .catch(err => console.log('err axios', err))
  }

  render() {
    if (this.state.thumbnail !== '') {
      return (
        <Image src={this.state.thumbnail} width="100" height="100"/>
      )
    } else {
      return null
    }
  }
}


export default Thumb;
