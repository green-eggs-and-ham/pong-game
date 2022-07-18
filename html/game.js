class paddle {
  constructor(side=0,ai=0) {
    this.x=-1;
    this.y=-1;
    this.nx=-1;
    this.ny=-1;
    this.ms=2;
    this.check_x=false;
    this.check_y=false;
    this.side=side;
    this.ai=ai;
    this.min_y=14;
    this.max_y=242;
    if (side==0) {
      this.min_x=8;
      this.max_x=248;
    } else {
      this.min_x=264;
      this.max_x=504;
    }
    this.reset_coords();
  }
  
  render() {
    setLineDash([]);
    stroke(255);
    strokeWeight(4);
    line(this.x,this.y-14,this.x,this.y+14);
  }
  
  reset_coords() {
    this.y=128;
    if (this.side) {
      this.x=496;
    } else {
      this.x=16;
    }
  }
  
  check_coords(x,y){
    this.check_x=false;
    this.check_y=false;
    if (this.min_x <= this.x+this.nx && this.x+this.nx <= this.max_x){
      this.check_x=true;
    }
    if (this.min_y <= this.y+this.ny && this.y+this.ny <= this.max_y){
      this.check_y=true;
    }
  }
  
  update_coords() {
    if (this.ai) {
      this.reset_coords();
    } else {
      this.nx=0;
      this.ny=0;
      if (keyIsDown(87)){
        this.ny=this.ny-this.ms;    
      }
      if (keyIsDown(83)){
        this.ny=this.ny+this.ms;
      }
      if (keyIsDown(65)){
        this.nx=this.nx-this.ms;
      }
      if (keyIsDown(68)){
        this.nx=this.nx+this.ms;
      }
      if (keyIsDown(32)){
        print("bash");    
      }
      this.check_coords(this.x+this.nx,this.y+this.ny);
      if (this.check_x){this.x=this.x+this.nx}
      if (this.check_y){this.y=this.y+this.ny}
    }
  }
  
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}



function setup() {
  createCanvas(512, 256);
  left_paddle=new paddle();
  right_paddle=new paddle(side=1);
}

function draw() {
  background(14);
  stroke(255);
  strokeWeight(2);
  setLineDash([5, 5]);
  line(256,0,256,256);
  left_paddle.render();
  right_paddle.render();
  left_paddle.update_coords();
}
