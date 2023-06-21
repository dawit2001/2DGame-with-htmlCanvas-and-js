let canvas, ctx;
window.addEventListener("load", () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        if (
          e.key === "ArrowUp" ||
          (e.key === "ArrowDown" && this.game.keys.indexOf(e.key) === -1)
        ) {
          this.game.keys.push(e.key);

          console.log(this.game.keys);
        } else if (e.key === " ") {
          this.game.Player.shootTop();
        }
        window.addEventListener("keyup", (e) => {
          if (this.game.keys.indexOf(e.key) > -1) {
            this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
            console.log(this.game.keys);
          }
        });
      });
    }
  }
  class Projectile {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 3;
      this.speed = 3;
      this.speed = 3;
      this.markedForDeletion = false;
    }
    update() {
      this.x += this.speed;
      if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
    }
    draw(context) {
      context.fillStyle = "yellow";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  class Particle {}
  class Player {
    constructor(game) {
      this.game = game;
      this.width = 120;
      this.height = 190;
      this.x = 20;
      this.y = 100;
      this.speedY = 1;
      this.maxSpeed = 2;
      this.Projectiles = [];
    }
    update() {
      if (this.game.keys.includes("ArrowUp")) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes("ArrowDown")) {
        this.speedY = this.maxSpeed;
      } else this.speedY = 0;

      this.speedY += this.speedY;
      this.y += this.speedY;
      this.Projectiles.forEach((Projectile) => {
        Projectile.update();
      });
      this.Projectiles = this.Projectiles.filter(
        (Projectile) => !Projectile.markedForDeletion
      );
    }
    draw(context) {
      context.fillStyle = "black";
      context.fillRect(this.x, this.y, this.width, this.height);
      this.Projectiles.forEach((Projectile) => {
        Projectile.draw(context);
      });
    }
    shootTop() {
      if (this.game.ammo > 0) {
        this.Projectiles.push(new Projectile(this.game, this.x, this.y));
        this.game.ammo--;
      }
    }
  }
  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = Math.random() * -1.5 - 0.5;
      this.markedForDeletion = false;
    }
    update() {
      this.x += this.speedX;
      if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context) {
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  class Angler1 extends Enemy {
    constructor(game) {
      super(game);
      this.width = 228 * 0.2;
      this.height = 169 * 0.2;
      this.y = Math.random() * (this.game.height + 0.9 - this.height);
    }
  }
  class Layer {}
  class Background {}
  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = "Helvetica";
      this.color = "yellow";
    }
    draw(context) {
      context.fillStyle = this.color;
      for (let i = 0; i < this.game.ammo; i++) {
        context.fillRect(20 + 5 * i, 50, 3, 20);
      }
    }
  }
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.Player = new Player(this);
      this.InputHandler = new InputHandler(this);
      this.UI = new UI(this);
      this.Enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.keys = [];
      this.ammo = 25;
      this.maxAmmo = 50;
      this.ammoTimer = 0;
      this.ammoInterval = 500;
      this.gameOver = false;
    }
    update(deltaTime) {
      this.Player.update();
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }
      this.Enemies.forEach((enemy) => {
        enemy.update();
        if (this.checkCollision(this.Player, enemy)) {
          enemy.markedForDeletion = true;
        }
      });
      this.Enemies = this.Enemies.filter((enemy) => !enemy.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    }
    draw(context) {
      this.Player.draw(context);
      this.UI.draw(context);
      this.Enemies.forEach((enemy) => {
        enemy.draw(context);
      });
    }
    addEnemy() {
      this.Enemies.push(new Angler1(this));
      console.log(this.Enemies);
    }
    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      );
    }
  }
  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  const animate = (timeStamp) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate);
  };
  animate(0);
});
