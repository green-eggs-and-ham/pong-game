class particle {
// setting the co-ordinates, radius and the
// speed of a particle in both the co-ordinates axes.
  constructor(){
    this.x = random(0,width*0.75);
    this.y = random(0,height*0.5);
    this.r = random(1,8);
    this.xSpeed = random(-2,2);
    this.ySpeed = random(-1,1.5);
  }

// creation of a particle.
  createParticle() {
    noStroke();
    fill('rgba(200,169,169,0.5)');
    circle(this.x,this.y,this.r);
  }

// setting the particle in motion.
  moveParticle() {
    if(this.x < 0 || this.x > width)
      this.xSpeed*=-1;
    if(this.y < 0 || this.y > height)
      this.ySpeed*=-1;
    this.x+=this.xSpeed;
    this.y+=this.ySpeed;
  }

// this function creates the connections(lines)
// between particles which are less than a certain distance apart
  joinParticles(particles) {
    particles.forEach(element =>{
      let dis = dist(this.x,this.y,element.x,element.y);
      if(dis<85) {
        stroke('rgba(255,255,255,0.04)');
        line(this.x,this.y,element.x,element.y);
      }
    });
  }
}//Inspired by Particle.js, contribution to Processing Foundation by Sagar Arora.

class game {
  constructor () {
    this.state=null;
    angleMode(DEGREES);
    frameRate(90);
    createCanvas(512,256+32);
  }
  
  render () {
    if (this.state=="game") {
      ticker=ticker+1;
      tick_multi=abs(sin(ticker));
      tick_multi_2=abs(cos(ticker));
      background(16*tick_multi,16*tick_multi,16*tick_multi,16*tick_multi_2+128);
      stroke(128,128,128);
      strokeWeight(2.5); //centerline
      setLineDash([7,7]); //^
      line(256,0-tick_multi*8,256,256+tick_multi_2*8);
      left_paddle.render();
      right_paddle.render();
      left_paddle.update_coords();
      right_paddle.update_coords();
      fill(64);
      noStroke();
      rect(0,256,512,9);
      fill(48);
      rect(0,256,250,9,0,5,5,0);
      rect(512,256,-250,9,0,5,5,0);
      fill(96);
      rect(0,265,512,25);
      left_paddle.render_bash();
      right_paddle.render_bash();
    }
    if (this.state=="menu") {
      //cool background
      ticker=ticker+1
      tick_multi=abs(sin(ticker));
      background(16*tick_multi,16*tick_multi,16*tick_multi,min(ticker,16*tick_multi+64));
      for(let i = 0;i<particles.length;i++) {
        particles[i].createParticle();
        particles[i].moveParticle();
        particles[i].joinParticles(particles.slice(i));
      }
      //add actual menu bellow lol
    }
  }
}

class ball {
  constructor () {
    this.x=width/2;
    this.y=height/2;
  }
}

class paddle {
  constructor(side=0,ai=0) {
    this.x=-1;
    this.y=-1;
    this.nx=-1;
    this.ny=-1;
    this.ms=3; //const1
    this.check_x=false;
    this.check_y=false;
    this.side=side;
    this.ai=ai;
    this.min_y=16;
    this.max_y=240;
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
    stroke((this.bash_start-this.bash_tick)/this.bash_start*16+64);
    strokeWeight(1.5);
    fill((this.bash_start-this.bash_tick)/this.bash_start*160+32);
    if (this.side) {
      rect(513,257,-1*(this.bash_start-this.bash_tick)/this.bash_start*250,7,0,5,5,0);
    } else {
      rect(-1,257,(this.bash_start-this.bash_tick)/this.bash_start*250,7,0,5,5,0);
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
        this.ms=3+abs(sin(this.ms_tick)*10);//ms increaser
      } else {
        this.ms=3; //const2
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
  ticker=0;
  tick_multi=ticker;
  tick_multi_2=ticker;
  particles=[];
  left_paddle=new paddle();
  right_paddle=new paddle(side=1,ai=0);
  for(let i = 0;i<width/3;i++){
    particles.push(new particle());
  }
  pong=new game();
  pong.state="game";
}

function draw() {
  pong.render();
}

function mousePressed() {
  fs = fullscreen();
  fullscreen(!fs);
  if (!fs) {
    document.body.style.zoom=windowWidth/width;this.blur();
  } else {
    document.body.style.zoom=1.0;
  }
}
