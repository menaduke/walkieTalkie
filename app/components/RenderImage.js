import React, { Component }  from 'react';
import { Thumbnail } from 'react-bootstrap';


class RenderImage extends Component {
  constructor(props){
    super(props)
  }

  //      <img src={this.props.value} height="300" width="500" />
  // <div dangerouslySetInnerHTML={template}/>
  render(){
    console.log('this is Render Image')
    console.log(this.props);
    return (
      <Thumbnail href="#" alt="171x180" src={this.props.value} />
    )
  }
}

export default RenderImage;