import './App.css';
import React from 'react';
class Game extends React.Component{
  constructor(props){
    super(props);
    let width = props.width;
    let height = props.height;
    this.state = {
      grid : new Array(width*height).fill(0),
      generation : 0,
      width:width,
      height:height
    }
  }
  onButtonClick(i){
    let grid = this.state.grid.slice();
    grid[i] = grid[i]===1 ? 0 : 1;
    this.setState({grid:grid})
  }
  nextGeneration(grid,width){
    let newgen = grid.slice();
    function countNeighbours(grid,width,index){
      let dirns = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
      let num = 0;
      for(let [x,y] of dirns){
        let pos = index + x + y*width;
        if(grid[pos] && grid[pos]===1){
          num++;
        }
      }
      return num;
    }
    for(let i=0;i<grid.length;i++){
      let n = countNeighbours(grid,width,i);
      let alive = grid[i]===1;
      if(!alive && n==3) newgen[i]=1;
      if(alive&&n<2) newgen[i]=0;
      if(alive&&n>3) newgen[i]=0;
    }
    return newgen;
  }
  componentDidMount(){
    this.toggleTimer();
  }
  toggleTimer(){
    if(!this.timer)
    this.timer = setInterval(()=>this.setState({grid:this.nextGeneration(this.state.grid,this.state.width),generation:this.state.generation+1}),200);
    else{
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  changeDimensions(v,h){
    let newgrid = [];
    for(let i=0;i<h;i++){
      for(let j=0;j<v;j++){
        let e;
        if(e = this.state.grid[i*this.state.width+j]){
          newgrid.push(e);
        }
        else{
          newgrid.push(0);
        }
      }
    }
    this.setState({width:v,grid:newgrid,height:h});
  }
  render(){
    return (
      <div class='game'>
        <div class='gameinfo'>
          Generation : {this.state.generation}
          <input type='button' value="Pause/Continue" onClick={this.toggleTimer.bind(this)} />
          Width:
          <input type='number' value={this.state.width} onChange={(e)=>this.changeDimensions(parseInt(e.target.value),this.state.height)} />
          Height : 
          <input type='number' value={this.state.height} onChange={(e)=>this.changeDimensions(this.state.width,parseInt(e.target.value))} />
        </div>
        <Grid matrix={this.state.grid} width={this.state.width} height={this.state.height} onButtonClick={(i)=>this.onButtonClick(i)}/>
      </div>
    );
  }
}
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Game height={100} width={100} />
      </header>
    </div>  
  );
}
function Grid(props){
  let matrix = props.matrix;
  let width = props.width;
  let height = props.height;
  let boxes = [];
  for(let i=0;i<height;i++){
    let row = [];
    for(let j=0;j<width;j++){
      let index = i*width+j;
      row.push((<Box className={matrix[index]==1?"alive":""} onClick={()=>props.onButtonClick(index)} />))
    }
    boxes.push(<div className='box-row'>{row}</div>);
  }
  return (<div className='grid'>{boxes}</div>)
}
function Box(props){
  return (<div className={`box ${props.className}`} onClick={props.onClick}>{props.value}</div>)
}
export default App;
