import React, { Component }  from 'react';
import { Thumbnail } from 'react-bootstrap';
import Youtube from 'react-youtube';
import YoutubePlayer from 'react-youtube-player';


  // <YouTube
  // videoId={string}                  // defaults -> null 
  // id={string}                       // defaults -> null 
  // className={string}                // defaults -> null 
  // opts={obj}                        // defaults -> {} 
  // onReady={func}                    // defaults -> noop 
  // onPlay={func}                     // defaults -> noop 
  // onPause={func}                    // defaults -> noop 
  // onEnd={func}                      // defaults -> noop 
  // onError={func}                    // defaults -> noop 
  // onStateChange={func}              // defaults -> noop 
  // onPlaybackRateChange={func}       // defaults -> noop 
  // onPlaybackQualityChange={func}    // defaults -> noop 
  // />

class RenderYoutube extends Component {
  constructor(props){
    super(props)
  }

  //      <img src={this.props.value} height="300" width="500" />
  // <div dangerouslySetInnerHTML={template}/>
  render(){
    console.log('this is Youtube Video')
    console.log(this.props.value.slice(32,this.props.value.length));
    return (
      <Thumbnail href="#" >
      <div style={{"height" : "360px", "width" : "100%"}}>
      <YoutubePlayer videoId={this.props.value.slice(32,this.props.value.length)} /> 
      </div>
      </Thumbnail>
    )
  }
}

export default RenderYoutube;