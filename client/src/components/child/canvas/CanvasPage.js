import React from 'react';
// import Canvas from './Canvas';
import axios from 'axios';

const styles = {
  canvas: {
    border: '1px solid #333',
    cursor: 'crosshair',
    // position: 'absolute',
    // left: '6px',
    // opacity: .8
  },

  maindiv: {
    padding: '10px',
    margin: 'auto',
    width: '800px',
  },

  button: {
    border: '0px',
    margin: '1px',
    height: '50px',
    minWidth: '75px',
  },

  colorSwatches: {
    red: { backgroundColor: 'red' },
    orange: { backgroundColor: 'orange' },
    yellow: { backgroundColor: 'yellow' },
    green: { backgroundColor: 'green' },
    blue: { backgroundColor: 'blue' },
    purple: { backgroundColor: 'purple' },
    black: { backgroundColor: 'black' },
  },
};

class CanvasPage extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      score:"",
      givenTime:15,
      countDown:''
    }
  }

  componentDidMount() {
    this.setState({
      countDown:this.state.givenTime
    },()=>{
      this.reset();
      this.sendDrawing(); 
    })
  
   
  }

  draw(e) {
    //response to Draw button click
    this.setState({
      mode: 'draw',
    });
  }

  drawing(e) {
    //if the pen is down in the canvas, draw/erase

    if (this.state.pen === 'down') {
      this.ctx.beginPath();
      this.ctx.lineWidth = this.state.lineWidth;
      this.ctx.lineCap = 'round';

      if (this.state.mode === 'draw') {
        this.ctx.strokeStyle = this.state.penColor;
      }

      if (this.state.mode === 'erase') {
        this.ctx.strokeStyle = '#ffffff';
      }

      this.ctx.moveTo(this.state.penCoords[0], this.state.penCoords[1]); //move to old position
      this.ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); //draw to new position
      this.ctx.stroke();

      this.setState({
        //save new position
        penCoords: [e.nativeEvent.offsetX, e.nativeEvent.offsetY],
      });
    }
  }

  penDown(e) {
    //mouse is down on the canvas
    this.setState({
      pen: 'down',
      penCoords: [e.nativeEvent.offsetX, e.nativeEvent.offsetY],
    });
  }

  penUp() {
    //mouse is up on the canvas
    this.setState({
      pen: 'up',
    });
  }

  reset() {
    //clears it to all white, resets state to original
    this.setState({
      mode: 'draw',
      pen: 'up',
      lineWidth: .6,
      penColor: 'black',
    });

    this.ctx = this.refs.canvas.getContext('2d');
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, 800, 600);
    this.ctx.lineWidth = 10;
  }
  startTimer(){
    let runningTimer = setInterval(()=>{
      if(this.state.countDown!==0){
        this.setState({
          countDown:this.state.countDown -1
        })
      }else{
        this.setState({
          countDown:this.state.givenTime
        })
        clearInterval(runningTimer)
      }
    },1000)
  }
  sendDrawing(){
    this.startTimer();
    // var canvas = this.refs.canvas.getContext('2d');
    setInterval(()=>{
      var canvas = document.getElementById('canvas__drawing');
      console.log(canvas)

      if(canvas){
      var dataURL = canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
      axios.post('/send_drawing',{dataURL:dataURL}).then(response=>{
        // console.log(response);
        const{score}= response.data;
        this.setState({
          score:score
        })
        this.reset();
        this.startTimer();
      })
    }
    },this.state.givenTime * 1000)
  }

  render() {
    return (
      /* We should separate this to another component (Canvas) for modularity reasons. But as we are using but we can't use the'ref' attribute
             in the functional components. We have to figure a way out later
            */
           <>
            <span id="countDown"> {this.state.countDown}</span>
           <span id="userScore">Score: {this.state.score && this.state.score+"%"}</span>
      <div className="canvas" style={styles.maindiv}>
        <canvas
          id="canvas__drawing"
          className="canvas__canvas"
          ref="canvas"
          width="800px"
          height="600px"
          style={styles.canvas}
          onMouseMove={e => this.drawing(e)}
          onMouseDown={e => this.penDown(e)}
          onMouseUp={e => this.penUp(e)}
        />
      </div>
      </>
    );
  }
}

export default CanvasPage;
