class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    //botão de iniciar e o fundo do menu
    this.load.image("startButton", "assets/start.png");
    this.load.image("backgroundMenu", "assets/background_menu.png");
  }

  create() {
    // imagem de fundo do menu
    this.add.image(400, 300, "backgroundMenu");

    //título do jogo
    this.add.text(250, 100, "Jogo do Labirinto", {
      fontSize: "48px",
      fill: "#fff",
    });

    //botão de iniciar e interação de clique
    let startButton = this.add.image(400, 400, "startButton").setInteractive();
    startButton.on("pointerdown", () => {
      this.scene.start("GameScene"); //primeira fase do jogo
    });
  }
}

//primeira fase do jogo
class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.score = 0; //placar
    this.hasKey = false; //chave
  }

  preload() {
    //imagens e o mapa
    this.load.image("player", "assets/player.png");
    this.load.image("key", "assets/key.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("door", "assets/door.png");
    this.load.tilemapTiledJSON("map", "assets/map.json");
    this.load.image("tiles", "assets/tileset.png");
    this.load.image("backgroundGame", "assets/background_game.png");
  }

  create() {
    //fundo da fase
    this.add.image(400, 300, "backgroundGame");

    // mapa e o tileset
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tileset", "tiles");
    map.createLayer("Ground", tileset, 0, 0);

    //jogador
    this.player = this.physics.add.sprite(100, 100, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    // chave em posição aleatória
    this.spawnKey();

    // porta para próxima fase
    this.door = this.physics.add.sprite(500, 200, "door");
    this.physics.add.overlap(
      this.player,
      this.door,
      this.enterDoor,
      null,
      this
    );

    // inimigo e sua movimentação
    this.enemy = this.physics.add.sprite(400, 200, "enemy");
    this.enemy.setVelocity(100, 100);
    this.enemy.setBounce(1, 1);
    this.enemy.setCollideWorldBounds(true);

    // placar
    this.scoreText = this.add.text(16, 16, "Placar: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    //colisão jogador/chave
    this.physics.add.overlap(
      this.player,
      this.keyItem,
      this.collectKey,
      null,
      this
    );

    //colisão jogador/inimigo para tela de game over
    this.physics.add.overlap(this.player, this.enemy, () => {
      this.scene.start("GameOverScene");
    });

    //controles de movimento para o jogador
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    //velocidade inicial do jogador
    this.player.setVelocity(0);

    //movimento horizontal
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    }

    //movimento vertical
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    }
  }

  //chave em posição aleatória
  spawnKey() {
    if (this.keyItem) {
      this.keyItem.destroy();
    }
    let x = Phaser.Math.Between(50, 750);
    let y = Phaser.Math.Between(50, 550);
    this.keyItem = this.physics.add.sprite(x, y, "key");

    //colisão jogador/chave
    this.physics.add.overlap(
      this.player,
      this.keyItem,
      this.collectKey,
      null,
      this
    );

    this.hasKey = false;
  }

  //chave aumenta o placar
  collectKey(player, key) {
    this.score += 10;
    this.scoreText.setText("Placar: " + this.score);
    key.destroy();
    this.hasKey = true;
  }

  //porta para próxima fase se tiver a chave
  enterDoor(player, door) {
    if (this.hasKey) {
      this.scene.start("GameScene2");
    }
  }
}

//segunda fase do jogo
class GameScene2 extends Phaser.Scene {
  constructor() {
    super("GameScene2");
    this.score = 10; //placar
    this.hasKey = false; //chave
  }

  preload() {
    //imagens e o mapa para a fase2
    this.load.image("player", "assets/player.png");
    this.load.image("key", "assets/key.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("door", "assets/door.png");
    this.load.tilemapTiledJSON("map", "assets/map.json");
    this.load.image("tiles", "assets/tileset.png");
    this.load.image("background", "assets/background_game2.png");
  }

  create() {
    //fundo da fase
    this.add.image(400, 300, "background");

    //mapa e o tileset
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tileset", "tiles");
    map.createLayer("Ground", tileset, 0, 0);

    //jogador
    this.player = this.physics.add.sprite(100, 100, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    //chave em uma posição aleatória
    this.spawnKey();

    //porta que leva à próxima fase
    this.door = this.physics.add.sprite(500, 200, "door");
    this.physics.add.overlap(
      this.player,
      this.door,
      this.enterDoor,
      null,
      this
    );

    //inimigo e sua movimentação
    this.enemy = this.physics.add.sprite(400, 200, "enemy");
    this.enemy.setVelocity(350, 350);
    this.enemy.setBounce(1, 1);
    this.enemy.setCollideWorldBounds(true);
    //segundo inimigo
    this.enemy2 = this.physics.add.sprite(200, 300, "enemy");
    this.enemy2.setVelocity(250, 250);
    this.enemy2.setBounce(1, 1);
    this.enemy2.setCollideWorldBounds(true);

    //placar
    this.scoreText = this.add.text(16, 16, "Placar: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    //colisão jogador/chave
    this.physics.add.overlap(
      this.player,
      this.keyItem,
      this.collectKey,
      null,
      this
    );

    //colisão jogador/inimigo para tela de game over
    this.physics.add.overlap(this.player, this.enemy, () => {
      this.scene.start("GameOverScene");
    });

    //colisão jogador/inimigo2 para tela de game over
    this.physics.add.overlap(this.player, this.enemy2, () => {
      this.scene.start("GameOverScene");
    });

    //movimento do jogador
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    //velocidade inicial do jogador como zero
    this.player.setVelocity(0);

    //movimento horizontal
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    }

    //movimento vertical
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    }
  }

  //chave em posição aleatória
  spawnKey() {
    if (this.keyItem) {
      this.keyItem.destroy();
    }
    let x = Phaser.Math.Between(50, 750);
    let y = Phaser.Math.Between(50, 550);
    this.keyItem = this.physics.add.sprite(x, y, "key");

    //colisão jogador/chave
    this.physics.add.overlap(
      this.player,
      this.keyItem,
      this.collectKey,
      null,
      this
    );

    this.hasKey = false;
  }

  //chave aumenta o placar
  collectKey(player, key) {
    this.score += 10;
    this.scoreText.setText("Placar: " + this.score);
    key.destroy();
    this.hasKey = true;
  }

  //porta para cena de vitoria se tiver a chave
  enterDoor(player, door) {
    if (this.hasKey) {
      this.scene.start("WinScene");
    }
  }
}
//tela de game over
class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  preload() {
    this.load.image("backgroundGameOver", "assets/background_gameover.png");
  }

  create() {
    this.add.image(400, 300, "backgroundGameOver");
    this.add.text(300, 100, "Game Over", { fontSize: "48px", fill: "#f00" });

    //reinicia o jogo ao clicar na tela
    this.input.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }
}

//tela de vitória
class WinScene extends Phaser.Scene {
  constructor() {
    super("WinScene");
  }

  preload() {
    this.load.image("backgroundWin", "assets/background_win.png");
  }

  create() {
    this.add.image(400, 300, "backgroundWin");
    this.add.text(300, 100, "Você Ganhou!", { fontSize: "48px", fill: "#0f0" });

    //retorna ao menu ao clicar na tela
    this.input.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }
}

//configurações do jogo
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: { default: "arcade", arcade: { debug: false } },
  scene: [MenuScene, GameScene, GameScene2, GameOverScene, WinScene],
};

const game = new Phaser.Game(config);

//Adicionei os assets a cena 2 e fiz o peprsongaem ser direcionado para a tela de vitória (WInScene) tela quando ele pega a chave e passa na porta.

//Ao player entrar na segunda fase, alterei a velocidade do "enemy", e acrescentei mais um enemy (enemy2).

//Também adicionei uma colião com o segundo inimigo que implementei na cena 2. Ao colidir com o ele, o jogo é redirecionado à tela de GameOver
