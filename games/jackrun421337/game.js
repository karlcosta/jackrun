/*
Hallo!
Das hir ist deine Spielevorlage!
Ich hoffe, ich habe alles gut genug dokumentiert.

Alles was hier MyGame heißt musst du umbennen in etwas sehr
individuelles. So wie KotzeMannGRKDM
Die wirren Buchstaben können wichtig sein, falls jemand anderes
auch KotzeMann entwickelt!

WICHTIG

Wenn dein Spiel geschafft ist, dann rufe

onVictory();

auf! Später wird da dann ein richtiger Gewonnenbildschrim erscheinen!

Wenn man in deinem Spiel verliert dann rufe

onLose()

auf, dardurch wird dein Spiel neugestartet.

Wärend du an deinem Spiel arbeitest, arbeite ich am Drumherum.
So dass es dann alles auch supi aussieht!
*/

/**
 * JackRun421337
 */
JackDanger.JackRun421337 = function() {

};

//hier musst du deine Eintragungen vornhemen.
addMyGame("jackrun421337", "Jack Run", "Karl_Costa", "Renn vor der Wand weg und sammle Primzahlen, 2er-Potenzen und andere tolle Zahlen!", JackDanger.JackRun421337);


JackDanger.JackRun421337.prototype.init = function() {
    logInfo("init JackRun");
    addLoadingScreen(this);//nicht anfassen
}

JackDanger.JackRun421337.prototype.preload = function() {
	logInfo("preload JackRun");
	this.load.path = 'games/' + currentGameData.id + '/assets/';//nicht anfassen
	
    //füge hier ein was du alles laden musst.
    this.load.atlas("jack");
	this.load.atlas("epyx_JDanger_tiles");
	this.load.tilemap("map", "map.json", null, Phaser.Tilemap.TILED_JSON);
	this.load.image("tiles", "epyx_JDanger_tiles.png");
}

//wird nach dem laden gestartet
JackDanger.JackRun421337.prototype.create = function() {
	logInfo("create JackRun");
	
    Pad.init();//nicht anfassen
    removeLoadingScreen();//nicht anfassen
	
	this.physics.startSystem(Phaser.Physics.ARCADE);
	
	this.stage.backgroundColor = 0x000000;
	this.windowWidth = game.width;
	this.windowHeight = game.height;
	this.lose = false;
	this.speed = 200;
	
	this.jackOffset = 64;
	var jackPos = {};
	jackPos.x = this.jackOffset;
	jackPos.y = 50;
	
	this.world = new JackDanger.JackRun421337.World(this);
	this.spikes = new JackDanger.JackRun421337.Spikes(this, this.world, this.speed);
	this.jack  = new JackDanger.JackRun421337.Jack(this, jackPos, this.speed);
	
	this.world.map.setTileIndexCallback([67,68,92,93], this.collectDiamond, this);
	
	this.physics.setBoundsToWorld();
}

//wird jeden Frame aufgerufen
JackDanger.JackRun421337.prototype.update = function() {
	var dt = this.time.physicsElapsedMS * 0.001;
	
	if (this.lose) {
		if (this.loseCounter == 0) {
			onLose();
		}
		this.loseCounter--;
	}
	else {
		// Kamera bewegen
		this.camera.x = this.jack.position.x - this.jackOffset;		
		this.physics.arcade.collide(this.jack.sprite, this.world.layer);
		this.physics.arcade.overlap(this.jack.sprite, this.spikes.sprites, this.spikesOverlap, null, this);
	}
	
	// Jack bewegen
	this.jack.update();
}

JackDanger.JackRun421337.prototype.render = function() {
	//game.debug.body(this.jack.sprite);
}

JackDanger.JackRun421337.prototype.collectDiamond = function(sprite, tile) {
	if (sprite === this.jack.sprite) {
		var number = this.randomIntFromInterval(1,2000);
		this.world.collectDiamond(tile, number);
	}
}

JackDanger.JackRun421337.prototype.spikesOverlap = function(sprite, tile) {
	// starte Verloren-Animation
	this.lose = true;
	this.loseCounter = 10;
	this.jack.killAnimation();
	this.spikes.stop();
}

JackDanger.JackRun421337.prototype.randomIntFromInterval = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 *	Jack
 */
JackDanger.JackRun421337.Jack = function(game, position, speed) {
	logInfo("generate Jack");
	
	this.position = position;
	this.speed = speed;
	this.kill = false;
	this.killFrame = false;
	
	// Jack-Sprite
	this.sprite = game.add.sprite(this.position.x, this.position.y, "jack", "jack_rechts0");
	
	// Sieg, falls Ende der Welt erreicht wird
	this.sprite.checkWorldBounds = true;
	this.sprite.events.onOutOfBounds.add(onVictory);
	
	game.physics.arcade.enable(this.sprite);
	
	// Jack nicht anhalten, wenn er Welt verlässt
	this.sprite.body.collideWorldBounds = false;
	this.sprite.body.velocity.x = speed;
	
	// Kollisions-Box
	this.sprite.body.setSize(this.sprite.width, this.sprite.height / 4, 0, 0.875 * this.sprite.height);
	
	this.setAnimations();
	this.doAnimation("right");
}

JackDanger.JackRun421337.Jack.prototype = {
	setAnimations: function() {
		this.sprite.animations.add("right", ["jack_rechts0", "jack_rechts1", "jack_rechts2"], 12, true, false);
	},
	
	doAnimation: function(name) {
		this.sprite.animations.play(name);
	},
	
	killAnimation: function() {
		this.kill = true;
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
		this.sprite.animations.stop();
	},
	
	update: function() {
		if (!this.kill) {
			// Bewegung
			this.sprite.body.velocity.x = this.speed;
			this.sprite.body.velocity.y = 0;
			if (Pad.isDown(Pad.UP)) {
				this.sprite.body.velocity.y = -this.speed;
			}

			if (Pad.isDown(Pad.DOWN)) {
				this.sprite.body.velocity.y = this.speed;
			}
			this.position.x = this.sprite.x;
			this.position.y = this.sprite.y;			
		}
		else {
			// Todes-Animation
			if (this.killFrame) {
				this.sprite.tint = 0xffffff;
			}
			else {
				this.sprite.tint = 0xff0000;
			}
			this.killFrame = !this.killFrame;
		}
	}
}

/**
 * World
 */
JackDanger.JackRun421337.World = function(game) {
	logInfo("generate world");
	this.game = game;
	
	this.map = this.game.add.tilemap("map");
	this.map.addTilesetImage("epyx_JDanger_tiles", "tiles");
	this.map.setCollision([226,227]);
	this.layer = this.map.createLayer("Kachelebene 1", 800, 450);
	this.layer.resizeWorld();

	this.setPassage();
	
	this.numberTextsSpeed = 100;
}

JackDanger.JackRun421337.World.prototype = {
	setPassage: function() {
		this.passage = {};
		this.passage.start = 1;
		this.passage.end = 12;
	},
	
	collectDiamond: function(tile, number) {
		this.replaceTile(tile);
		
		// Text für Nummer erstellen
		var numberText = this.game.add.bitmapText(tile.x * this.map.tileWidth, tile.y * this.map.tileHeight, "testfont", number.toString(), 16);
		
		numberText.checkWorldBounds = true;
		numberText.events.onOutOfBounds.add(this.destroy, numberText);
		
		this.game.physics.arcade.enable(numberText);
	
		numberText.body.collideWorldBounds = false;
		numberText.body.velocity.y = -this.numberTextsSpeed;
	},
	
	replaceTile(tile) {
		this.map.replace(tile.index, 143, tile.x, tile.y, 1, 1, this.layer);
	},
	
	destroy: function(object) {
		object.destroy(true);
	}
}

/**
 * Spikes
 */
JackDanger.JackRun421337.Spikes = function(game, world, speed) {
	logInfo("generate spikes");
	
	this.sprites = game.add.physicsGroup(Phaser.Physics.ARCADE);
	
	for (var i = world.passage.start; i <= world.passage.end; i++) {
		// Spitzen
		var spike = this.sprites.create(0.5 * world.map.tileWidth, (i + 0.5) * world.map.tileHeight, "epyx_JDanger_tiles", "spikes");
		spike.anchor.setTo(0.5, 0.5);
		spike.angle = 90;
		
		game.physics.arcade.enable(spike);
		spike.body.velocity.x = speed;
		
		// Wand hinter Spitzen
		for (var j = 1; j < game.windowWidth / world.map.tileWidth; j++) {
			var wall = this.sprites.create(-j * world.map.tileWidth, i * world.map.tileHeight, "epyx_JDanger_tiles", "wall_brown");
			
			game.physics.arcade.enable(wall);
			wall.body.velocity.x = speed;			
		}
	}
}

JackDanger.JackRun421337.Spikes.prototype = {
	stop() {
		for (var i = 0; i < this.sprites.children.length; i++) {
			this.sprites.children[i].body.velocity.x = 0;
		}
	}
}