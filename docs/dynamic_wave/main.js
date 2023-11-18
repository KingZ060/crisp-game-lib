title = "Dynamic Wave Bounce";

description = `
[Tap] Create Expanding Wave
`;

characters = [
  `
  rrr
  rrr
  rrr
  `,
  `
  ggg
  ggg
  ggg
  `,
];

const G = {
  WIDTH: 200,
  HEIGHT: 250,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 28,
  theme: "pixel",
};

let balls;
let waves;
let spawnTimer = 0;

function update() {
  if (!ticks) {
    balls = [];
    waves = [];
  }

  spawnTimer++;
  if (spawnTimer >= 180) {
    balls.push({ pos: vec(rnd(20, 180), 0), color: "red", bounceTimer: 0 });
    spawnTimer = 0;
    addScore(1);
  }

  if (input.isJustPressed) {
    waves.push({
      active: true,
      radius: 5,
      pos: vec(input.pos.x, input.pos.y),
      timer: 0,
    });
  }

  waves.forEach((wave) => {
    if (wave.active) {
      wave.timer += 1;
      if (wave.timer >= 20) {
        wave.radius = 10;
      }
      if (wave.timer > 60) {
        wave.active = false;
        wave.radius = 0;
      }

      if (wave.active) {
        color("cyan");
        arc(wave.pos, wave.radius, 2, PI, 2 * PI);
      }
    }
  });

  waves = waves.filter((wave) => wave.active);

  balls.forEach((ball) => {
    color(ball.color);
    char(ball.color === "red" ? "a" : "b", ball.pos);

    if (ball.color === "red") {
      ball.pos.y += 1;
    } else {
      ball.pos.y -= 1;
      ball.bounceTimer++;

      if (ball.bounceTimer >= 120) {
        ball.color = "red";
        ball.bounceTimer = 0;
      }
    }

    waves.forEach((wave) => {
      if (
        wave.active &&
        ball.pos.distanceTo(wave.pos) < wave.radius &&
        ball.color === "red"
      ) {
        ball.color = "green";
        ball.bounceTimer = 0;
      }
    });
    
    if (ball.pos.y > G.HEIGHT) {
      play("explosion");
      end();
    }
  });
}
