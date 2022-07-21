class particle {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
  constructor() {
    this.x = random(0, 512);
    this.y = random(0, 288);
    this.r = random(1, 8);
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-1, 1.5);
  }

  // creation of a particle.
  createParticle() {
    noStroke();
    fill("rgba(200,169,169,0.2)");
    circle(this.x, this.y, this.r);
  }

  // setting the particle in motion.
  moveParticle() {
    if (this.x < 0 || this.x > width) this.xSpeed *= -1;
    if (this.y < 0 || this.y > height) this.ySpeed *= -1;
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  // this function creates the connections(lines)
  // between particles which are less than a certain distance apart
  joinParticles(particles) {
    particles.forEach((element) => {
      let dis = dist(this.x, this.y, element.x, element.y);
      if (dis < 85) {
        stroke("rgba(255,255,255,0.04)");
        line(this.x, this.y, element.x, element.y);
      }
    });
  }
} //Inspired by Particle.js, contribution to Processing Foundation by Sagar Arora.

class game {
  constructor() {
    this.state = null;
    this.game_state = null;
    angleMode(DEGREES);
    frameRate(90);
    createCanvas(512, 256 + 32);
    this.left_health = 3;
    this.right_health = 3;
    this.left_score = 0;
    this.right_score = 0;
    this.tick_reset = 255;
  }

  tick() {
    if (this.game_state == "reset") {
      left_paddle.reset_coords();
      right_paddle.reset_coords();
      puck.reset_coords();
      textSize(64);
      noStroke();
      fill(255, 255, 255, this.tick_reset - ticker);
      text(pong.left_score, 128, 64);
      text(pong.right_score, 352, 64);
      frameRate(90);
      pong.left_health = 3;
      pong.right_health = 3;
      puck.serve();
      if (ticker > this.tick_reset) {
        this.game_state = "play";
      }
    }
    if (this.game_state == "play") {
      left_paddle.update_coords();
      right_paddle.update_coords();
      puck.update_coords();
    }
  }

  render() {
    if (this.state == "game") {
      ticker = ticker + 1;
      tick_multi = abs(sin(ticker));
      tick_multi_2 = abs(cos(ticker));
      background(
        16 * tick_multi,
        16 * tick_multi,
        16 * tick_multi,
        16 * tick_multi_2 + 128
      );
      for (let i = 0; i < particles.length; i++) {
        particles[i].createParticle();
        particles[i].moveParticle();
        particles[i].joinParticles(particles.slice(i));
      }
      stroke(128, 128, 128);
      strokeWeight(2.5); //centerline
      setLineDash([7, 7]); //^
      line(256, 0 - tick_multi * 8, 256, 256 + tick_multi_2 * 8);
      noStroke();
      if (pong.left_health == 3) {
        fill(239);
      }
      if (pong.left_health == 2) {
        fill(112);
      }
      if (pong.left_health == 1) {
        noFill();
      }
      if (pong.left_health < 1) {
        noFill();
        pong.right_score = pong.right_score + 1;
        this.tick_reset = ticker + 255;
        pong.game_state = "reset";
      }
      rect(-8, 0, 16, 256, 0, 15, 15, 0);
      if (pong.right_health == 3) {
        fill(239);
      }
      if (pong.right_health == 2) {
        fill(112);
      }
      if (pong.right_health == 1) {
        noFill();
      }
      if (pong.right_health < 1) {
        noFill();
        pong.left_score = pong.left_score + 1;
        this.tick_reset = ticker + 255;
        pong.game_state = "reset";
      }
      rect(520, 0, -16, 256, 0, 15, 15, 0);
      left_paddle.render();
      right_paddle.render();
      puck.render();
      fill(64);
      noStroke();
      rect(0, 256, 512, 9);
      fill(48);
      rect(0, 256, 250, 9, 0, 5, 5, 0);
      rect(512, 256, -250, 9, 0, 5, 5, 0);
      fill(96);
      rect(0, 265, 512, 25);
      fill(255);
      textSize(16);
      text("Full Screen", 216, 282);
      stroke(64);
      strokeWeight(3);
      line(212, 265, 212, 295);
      line(300, 265, 300, 295);
      left_paddle.render_bash();
      right_paddle.render_bash();
    }
    if (this.state == "menu") {
      //cool background
      ticker = ticker + 1;
      tick_multi = abs(sin(ticker));
      background(
        16 * tick_multi,
        16 * tick_multi,
        16 * tick_multi,
        min(ticker, 16 * tick_multi + 64)
      );
      for (let i = 0; i < particles.length; i++) {
        particles[i].createParticle();
        particles[i].moveParticle();
        particles[i].joinParticles(particles.slice(i));
      }
      //add actual menu bellow at this level of indentation lol
    }
  }
}

class ball {
  constructor() {
    this.reset_coords();
    this.nx = 0;
    this.ny = 0;
    this.ox = 0;
    this.oy = 0;
    this.min_y = 10;
    this.max_y = 246;
    this.min_x = 18;
    this.max_x = 496;
    this.collision = false;
    this.radius = 5;
    this.rect = null;
    this.ovx = 0;
  }

  reset_coords() {
    this.x = 256;
    this.y = 128;
    this.vx = 0;
    this.vy = 0;
    this.bvx = 0;
    this.bvy = 0;
  }

  serve(side = 0, random = 1) {
    if (random) {
      if (round(Math.random())) {
        side = 1;
      }
    }
    if (side) {
      this.vx = Math.random() * 0.5 + 1;
    } else {
      this.vx = Math.random() * -0.5 - 1;
    }
    if (round(Math.random())) {
      this.vy = Math.random() * 0.5 + 1;
    } else {
      this.vy = Math.random() * -0.5 - 1;
    }
    this.bvx = this.vx;
    this.bvy = this.vy;
  }

  rect_circle_intersection() {
    var distX = Math.abs(this.x - this.rect.x - 2);
    var distY = Math.abs(this.y - this.rect.y - 14.5);

    if (distX > 2 + this.radius) {
      return false;
    }
    if (distY > 14.5 + this.radius) {
      return false;
    }

    if (distX <= 2) {
      return true;
    }
    if (distY <= 14.5) {
      return true;
    }

    var dx = distX - 2;
    var dy = distY - 14.5;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  reflect_x() {
    this.vx = this.vx * -1;
  }

  score() {
    this.vx = this.vx * -1;
    if (this.min_x >= this.nx) {
      this.nx = this.min_x - this.nx;
      pong.left_health = pong.left_health - 1;
    } else {
      this.nx = this.nx - this.max_x;
      pong.right_health = pong.right_health - 1;
    }
  }

  reflect_y() {
    this.vy = this.vy * -1;
    if (this.min_y >= this.ny) {
      this.ny = this.radius * 2 - this.ny;
    } else {
      this.ny = this.ny - this.radius * 2;
    }
  }

  transfer_velocity() {
    this.ovx = this.vx;
    if (this.x < 256) {
      this.vx = this.vx + this.rect.vx / 5 + 1;
    } else {
      this.vx = this.vx + this.rect.vx / 5 - 1;
    }
    this.vy = this.vy + this.rect.vy / 5;
    if (Math.sign(this.ovx) == Math.sign(this.vx)) {
      //play cool sound
    } else {
      if (this.x < 256) {
        left_paddle.break_cooldown = 90;
      } else {
        right_paddle.break_cooldown = 90;
      }
    }
  }

  check_collision() {
    this.collision = false;
    if (this.x < 256) {
      this.rect = left_paddle;
    } else {
      this.rect = right_paddle;
    }
    if (
      this.rect_circle_intersection() &&
      !this.rect.collision_cooldown &&
      !this.rect.break_cooldown
    ) {
      this.collision = true;
      if (Math.sign(this.vx) != Math.sign(this.rect.vx)) {
        this.reflect_x();
      } else {
        this.transfer_velocity();
      }
      if (this.x < 256) {
        left_paddle.collision_cooldown = 30;
      } else {
        right_paddle.collision_cooldown = 30;
      }
    }
    if (
      (this.min_x - this.radius > this.nx ||
        this.nx > this.max_x + this.radius) &&
      !this.collision
    ) {
      this.collision = true;
      this.score();
    }
    if (
      this.min_y - this.radius > this.ny ||
      this.ny > this.max_y + this.radius
    ) {
      this.collision = true;
      this.reflect_y();
    }
  }

  update_coords() {
    this.ox = this.x;
    this.oy = this.y;
    this.nx = this.x + this.vx;
    this.ny = this.y + this.vy;
    this.check_collision();
    if (!this.collision) {
      this.x = this.nx;
      this.y = this.ny;
    }
  }

  render() {
    noStroke();
    fill(255);
    circle(this.x, this.y, this.radius * 2);
  }
}

class paddle {
  constructor(side = 0, ai = 0, ai_level = 0) {
    this.x = -1;
    this.y = -1;
    this.vx = 0;
    this.vy = 0;
    this.ox = 0;
    this.oy = 0;
    this.nx = -1;
    this.ny = -1;
    this.health = 3;
    this.target_x = 0;
    this.target_y = 0;
    this.mode = 0;
    this.ms = 3; //const1
    this.check_x = false;
    this.check_y = false;
    this.side = side;
    this.ai = ai;
    this.ai_level = ai_level;
    this.min_y = 16;
    this.max_y = 240;
    this.bash_tick = 0;
    this.bash_start = 360;
    this.ms_tick = 0;
    this.bash_length = 15;
    this.collision_cooldown = 0;
    this.break_cooldown = 0;
    if (side == 0) {
      this.min_x = 8;
      this.max_x = 248;
    } else {
      this.min_x = 264;
      this.max_x = 504;
    }
    this.reset_coords();
  }

  render() {
    setLineDash([]);
    if (this.break_cooldown) {
      stroke(128);
    } else {
      stroke(255);
    }
    strokeWeight(4);
    line(this.x, this.y - 14, this.x, this.y + 14);
  }

  render_bash() {
    stroke(((this.bash_start - this.bash_tick) / this.bash_start) * 16 + 64);
    strokeWeight(1.5);
    fill(((this.bash_start - this.bash_tick) / this.bash_start) * 160 + 32);
    if (this.side) {
      rect(
        513,
        257,
        ((-1 * (this.bash_start - this.bash_tick)) / this.bash_start) * 250,
        7,
        0,
        5,
        5,
        0
      );
    } else {
      rect(
        -1,
        257,
        ((this.bash_start - this.bash_tick) / this.bash_start) * 250,
        7,
        0,
        5,
        5,
        0
      );
    }
  }

  reset_coords() {
    this.bash_tick = 0;
    this.y = 128;
    if (this.side) {
      this.x = 496;
    } else {
      this.x = 16;
    }
  }

  calculate_velocity() {
    this.vx = this.x - this.ox;
    this.vy = this.y - this.oy;
  }

  check_coords() {
    this.check_x = false;
    this.check_y = false;
    if (this.min_x <= this.x + this.nx && this.x + this.nx <= this.max_x) {
      this.check_x = true;
    }
    if (this.min_y <= this.y + this.ny && this.y + this.ny <= this.max_y) {
      this.check_y = true;
    }
  }

  tick() {
    if (this.bash_tick) {
      this.bash_tick = this.bash_tick - 1;
    }
    if (this.collision_cooldown) {
      this.collision_cooldown = this.collision_cooldown - 1;
    }
    if (this.break_cooldown) {
      this.break_cooldown = this.break_cooldown - 1;
    }
  }

  up() {
    this.ny = this.ny - this.ms;
  }

  down() {
    this.ny = this.ny + this.ms;
  }

  left() {
    this.nx = this.nx - this.ms;
  }

  right() {
    this.nx = this.nx + this.ms;
  }

  bash() {
    if (!this.bash_tick) {
      this.mode = 0;
      this.bash_tick = this.bash_start;
      this.bash_length = 15;
      this.break_cooldown = 10;
    } else {
      if (this.bash_tick < 345) {
        this.bash_length = 15 - (this.bash_tick / this.bash_start) * 15;
        this.break_cooldown = 5;
        this.bash_tick = this.bash_start;
      }
    }
  }

  select_target() {
    if (side == 0) {
      this.health = pong.left_health;
    } else {
      this.health = pong.right_health;
    }
    if (
      !Math.floor(Math.random() * (1.5 * this.health)) ||
      this.bash_tick > this.bash_start - this.bash_length
    ) {
      if (puck.x < 256) {
        if (this.side == 0) {
          if (this.x > puck.x) {
            this.mode = 1;
          } else {
            this.mode = 0;
          }
          if (Math.round(Math.random()) || abs(puck.vx) < 3) {
            this.target_x = puck.x - 7;
          } else {
            this.target_x = 32;
          }
          this.target_y = puck.y;
        } else {
          this.target_x = 481;
          this.target_y = 128;
        }
      } else {
        if (this.side == 1) {
          if (this.x < puck.x) {
            this.mode = 1;
          } else {
            this.mode = 0;
          }
          if (Math.round(Math.random()) || abs(puck.vx) < 3) {
            this.target_x = puck.x + 7;
          } else {
            this.target_x = 480;
          }
          this.target_y = puck.y;
        } else {
          this.target_x = 33;
          this.target_y = 128;
        }
      }
    }
  }

  update_coords() {
    this.ox = this.x;
    this.oy = this.y;
    this.nx = 0;
    this.ny = 0;
    this.tick();
    if (this.ai) {
      this.select_target();
      if (this.x > this.target_x) {
        this.left();
      }
      if (this.x < this.target_x) {
        this.right();
      }
      if (this.y > this.target_y) {
        this.up();
      }
      if (this.y < this.target_y) {
        this.down();
      }
      if (this.mode == 1) {
        this.bash();
      }
    } else {
      if (keyIsDown(87)) {
        //w
        this.up();
      }
      if (keyIsDown(83)) {
        //s
        this.down();
      }
      if (keyIsDown(65)) {
        //a
        this.left();
      }
      if (keyIsDown(68)) {
        //d
        this.right();
      }
      if (keyIsDown(32)) {
        //space
        this.bash();
      }
    }
    if (this.bash_tick > this.bash_start - this.bash_length) {
      //tick duration from 360
      this.ms_tick = this.ms_tick + 6;
      this.ms = 3 + abs(sin(this.ms_tick) * 10); //ms increaser
    } else {
      this.ms = 3; //const2
      this.ms_tick = 0;
    }
    this.check_coords();
    if (this.check_x) {
      this.x = this.x + this.nx;
    }
    if (this.check_y) {
      this.y = this.y + this.ny;
    }
    this.calculate_velocity();
  }
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
} //alters the style of future rendered lines

function setup() {
  ticker = 0;
  tick_multi = ticker;
  tick_multi_2 = ticker;
  particles = [];
  left_paddle = new paddle((side = 0), (ai = 0));
  right_paddle = new paddle((side = 1), (ai = 1));
  puck = new ball();
  for (let i = 0; i < width / 3; i++) {
    particles.push(new particle());
  }
  pong = new game();
  pong.state = "game"; //temp
  pong.game_state = "reset"; //temp
}

function draw() {
  pong.tick();
  pong.render();
}

function mousePressed() {
  fs = fullscreen();
  if (fs) {
    multi = windowWidth / width;
  } else {
    multi = 1;
  }
  if (
    mouseX > 212 * multi &&
    mouseX < 300 * multi &&
    mouseY > 265 * multi &&
    mouseY < 295 * multi
  ) {
    fullscreen(!fs);
    if (!fs) {
      document.body.style.zoom = windowWidth / width; //this.blur();
    } else {
      document.body.style.zoom = 1.0;
    }
  }
}
