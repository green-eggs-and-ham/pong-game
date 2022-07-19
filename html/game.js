class paddle {
  constructor(side=0,ai=0) {
    this.x=-1;
    this.y=-1;
    this.nx=-1;
    this.ny=-1;
    this.ms=4; //const1
    this.check_x=false;
    this.check_y=false;
    this.side=side;
    this.ai=ai;
    this.min_y=14;
    this.max_y=242;
    this.bash_tick=0;
    this.bash_start=360;
    this.ms_tick=0;
    this.bash_length=15;
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
  
  render_bash() {
    noStroke();
    fill(192);
    if (this.side) {
      rect(512,256,-1*(this.bash_start-this.bash_tick)/this.bash_start*250,16,0,5,5,0);
    } else {
      rect(0,256,(this.bash_start-this.bash_tick)/this.bash_start*250,16,0,5,5,0);
    }
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
  
  recharge(){
    if (this.bash_tick){
      this.bash_tick=this.bash_tick-1;
    }
  }
  
  update_coords() {
    if (this.ai) {
      this.reset_coords();
    } else {
      this.nx=0;
      this.ny=0;
      this.recharge();
      if (keyIsDown(87)){ //w
        this.ny=this.ny-this.ms;
        //this.recharge();
      }
      if (keyIsDown(83)){ //s
        this.ny=this.ny+this.ms;
        //this.recharge();
      }
      if (keyIsDown(65)){ //a
        this.nx=this.nx-this.ms;
        //this.recharge();
      }
      if (keyIsDown(68)){ //d
        this.nx=this.nx+this.ms;
        //this.recharge();
      }
      if (keyIsDown(32)){ //space
        if (!this.bash_tick) {
          this.bash_tick=this.bash_start;
          this.bash_length=15;
        } else {
          if (this.bash_tick < 345) {
            this.bash_length=15-this.bash_tick/this.bash_start*15;
            this.bash_tick=this.bash_start;
          }
        }
      }
      if (this.bash_tick > this.bash_start - this.bash_length){ //tick duration from 360
        this.ms_tick=this.ms_tick+6;
        this.ms=4+abs(sin(this.ms_tick)*10);//ms increaser
      } else {
        this.ms=4; //const2
        this.ms_tick=0;
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
  angleMode(DEGREES);
  frameRate(90);
  createCanvas(512,256+16);
  left_paddle=new paddle();
  right_paddle=new paddle(side=1,ai=0);
  ticker=0;
}

function draw() {
  ticker=ticker+1;
  tick_multi=abs(sin(ticker));
  tick_multi_2=abs(cos(ticker));
  background(16*tick_multi,16*tick_multi,16*tick_multi,16*tick_multi_2+64);
  stroke(128,128,128);
  strokeWeight(2);
  setLineDash([5,5]);
  line(256,0-tick_multi*8,256,256+tick_multi_2*8);
  left_paddle.render();
  right_paddle.render();
  left_paddle.update_coords();
  right_paddle.update_coords();
  fill(64);
  noStroke();
  rect(0,256,512,16);
  fill(48);
  rect(0,256,250,16,0,5,5,0);
  rect(512,256,-250,16,0,5,5,0);
  left_paddle.render_bash();
  right_paddle.render_bash();
}
