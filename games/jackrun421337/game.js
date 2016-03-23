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
addMyGame("jackrun421337", "Jack Run", "Karl_Costa", "Entkomme der Stachelwand!",
			"Ausweichen", "Boost", "-", JackDanger.JackRun421337);


JackDanger.JackRun421337.prototype.init = function() {
    logInfo("init JackRun");
    addLoadingScreen(this, false);//nicht anfassen
}

JackDanger.JackRun421337.prototype.preload = function() {
	logInfo("preload JackRun");
	this.load.path = 'games/' + currentGameData.id + '/assets/';//nicht anfassen
	
    //füge hier ein was du alles laden musst.
    this.load.atlas("jack");
	this.load.atlas("epyx_JDanger_tiles");
	this.load.atlas("dangers");
	this.load.tilemap("map", "map.json", null, Phaser.Tilemap.TILED_JSON);
	this.load.image("tiles", "epyx_JDanger_tiles.png");
	this.load.audio("kill", ["kill.mp3", "kill.ogg"]);
	this.load.audio("boost", ["boost.mp3", "boost.ogg"]);
	this.load.audio("diamond_pos", ["diamond_pos.mp3", "diamond_pos.ogg"]);
	this.load.audio("diamond_neg", ["diamond_neg.mp3", "diamond_neg.ogg"]);
	this.load.audio("fall", ["fall.mp3", "fall.ogg"]);
	this.load.audio("title", ["title.mp3", "title.ogg"]);
}

//wird nach dem laden gestartet
JackDanger.JackRun421337.prototype.create = function() {
	logInfo("create JackRun");
	
    Pad.init();//nicht anfassen
    //removeLoadingScreen();//nicht anfassen
}

JackDanger.JackRun421337.prototype.mycreate = function() {
	this.sounds = [];
	
	// Titel-Musik starten
	this.playSound("title");
	
	this.initialized = false;
	this.initializing = false;
}

JackDanger.JackRun421337.prototype.initialize = function() {
	this.initializing = true;
	var spritesheetGen = new JackDanger.JackRun421337.SpritesheetGenerator(this);
	spritesheetGen.createSpriteSheet("dangers", "SpikeBall2");
	
	this.physics.startSystem(Phaser.Physics.ARCADE);
	
	this.stage.backgroundColor = 0x000000;
	this.windowWidth = game.width;
	this.windowHeight = game.height;
	this.lose = false;
	this.speed = 200;
	this.points = 0;
	this.maxPoints = 10;
	
	this.jackOffset = 64;
	var jackPos = {};
	jackPos.x = this.jackOffset;
	jackPos.y = 50;
	
	// Welt laden
	this.world = new JackDanger.JackRun421337.World(this);
	
	// Gefahren laden
	var group = this.world.getObjects("SpikeBall", "SpikeBall2");
	this.spikeballs = new JackDanger.JackRun421337.Spikeballs(group, this.speed);
	this.spikes = new JackDanger.JackRun421337.Spikes(this, this.world, this.speed);
	
	// Jack laden
	this.jack  = new JackDanger.JackRun421337.Jack(this, jackPos, this.speed);
	
	// HUD laden
	this.hud = new JackDanger.JackRun421337.HUD(this);
	this.hud.setPoints(this.points, this.maxPoints);
	
	this.world.map.setTileIndexCallback([67,68,92,93], this.collectDiamond, this);
	
	this.physics.setBoundsToWorld();
	
	this.initializing = false;
	this.initialized = true;
}

//wird jeden Frame aufgerufen
JackDanger.JackRun421337.prototype.update = function() {
	if (!this.initialized) {
		if (this.cache != null && this.cache.isSoundDecoded("title") && !this.initializing) {
			this.initialize();
		}
		return;
	}
	
	var dt = this.time.physicsElapsedMS * 0.001;
	
	if (this.lose) {
		if (this.loseCounter == 0) {
			this.stopSounds();
			onLose();
		}
		this.loseCounter--;
	}
	else {
		// Spieler-Steuerung
		this.playerControls();
		
		// Kamera bewegen
		this.camera.x = this.jack.position.x - this.jackOffset;		
		
		// Kollisions-Erkennung
		this.physics.arcade.collide(this.jack.sprite, this.world.layer);
		this.physics.arcade.overlap(this.jack.sprite, this.spikes.sprites, this.spikesDeath, null, this);
		this.physics.arcade.overlap(this.jack.sprite, this.spikeballs.sprites, this.spikesDeath, null, this);
		this.physics.arcade.overlap(this.jack.sprite, this.world.holeColliders, this.holeDeath, null, this);
		this.physics.arcade.collide(this.spikeballs.sprites, this.world.layer);
	}
	
	// Jack bewegen
	this.jack.update(dt);
}

JackDanger.JackRun421337.prototype.render = function() {
	/*if (this.jack != null) {
		game.debug.body(this.jack.sprite);
	}*/
	/*if (this.spikeballs != null) {
		for (var i = 0; i < this.spikeballs.sprites.children.length; i++) {
			game.debug.body(this.spikeballs.sprites.children[i]);
		}
	}*/
	/*if (this.world.holeColliders != null) {
		for (var i = 0; i < this.world.holeColliders.children.length; i++) {
			game.debug.body(this.world.holeColliders.children[i]);
		}
	}*/
}

JackDanger.JackRun421337.prototype.playerControls = function() {
	// Bewegung y-Achse
	if (Pad.isDown(Pad.UP)) {
		this.jack.moveUp();
	}
	else if (Pad.isDown(Pad.DOWN)) {
		this.jack.moveDown();
	}
	else {
		this.jack.stopMove();
	}
	
	// Boost
	if (Pad.justDown(Pad.JUMP)) {
		if (this.points == this.maxPoints) {
			this.jack.speedUp(2, 0.5);
			this.playSound("boost");
			this.updatePoints();
		}
	}
}

JackDanger.JackRun421337.prototype.collectDiamond = function(sprite, tile) {
	if (sprite === this.jack.sprite) {
		var points;
		if (tile.index == 67) {
			// roter Diamant
			points = 1;
		}
		else if (tile.index == 68) {
			// blauer Diamant
			points = 10;
		}
		else if (tile.index == 92) {
			// grüner Diamant
			points = 5;
		}
		else if (tile.index == 93) {
			// violetter Diamant
			points = - this.randomIntFromInterval(1,10);
		}
		
		this.addPoints(points);
		if (points > 0) {
			this.playSound("diamond_pos");
		}
		else {
			this.playSound("diamond_neg");
		}
		this.world.collectDiamond(tile, points);
	}
}

JackDanger.JackRun421337.prototype.holeDeath = function(jack, holeCollider) {
	if (!this.lose) {
		this.death(20);
		this.playSound("fall");
			
		holePos = this.world.getHolePos(holeCollider);
			
		// starte Fall-Animation
		this.jack.fallAnimation(holePos);
	}
}

JackDanger.JackRun421337.prototype.spikesDeath = function(jack, spikes) {
	if (!this.lose) {
		this.death(20);
		this.playSound("kill");
		
		// starte Verloren-Animation
		this.jack.killAnimation();
	}
}

JackDanger.JackRun421337.prototype.death = function(loseCounter) {
	this.lose = true;
	this.loseCounter = loseCounter;
	this.spikes.stop();
	this.spikeballs.stop();
}

JackDanger.JackRun421337.prototype.addPoints = function(points) {
	this.points += points;
	if (this.points > this.maxPoints) {
		this.points = this.maxPoints;
	}
	else if (this.points < 0) {
		this.points = 0;
	}
	
	this.hud.setPoints(this.points, this.maxPoints);
}

/**
 * Setzt die Punkte wieder auf 0 und erhöht die maximale Puntkeanzahl
 */
JackDanger.JackRun421337.prototype.updatePoints = function() {
	this.points = 0;
	this.maxPoints *= 2;
	
	this.hud.setPoints(this.points, this.maxPoints);
}

JackDanger.JackRun421337.prototype.playSound = function(name) {
	var sound = this.add.audio(name);
	sound.play();
	this.sounds.push(sound);
}

JackDanger.JackRun421337.prototype.stopSounds = function() {
	for (var i = 0; i < this.sounds.length; i++) {
		this.sounds[i].stop();
	}
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
	this.speedFactor = 1;
	this.factorDuration = 0;
	this.kill = false;
	this.fall = false;
	this.killFrame = false;
	
	// Jack-Sprite
	this.sprite = game.add.sprite(this.position.x, this.position.y, "jack", "jack_rechts0");
	this.sprite.anchor.setTo(0.5, 0.5);
	
	// Sieg, falls Ende der Welt erreicht wird
	this.sprite.checkWorldBounds = true;
	this.sprite.events.onOutOfBounds.add(onVictory);
	
	game.physics.arcade.enable(this.sprite);
	
	// Jack nicht anhalten, wenn er Welt verlässt
	this.sprite.body.collideWorldBounds = false;
	this.sprite.body.velocity.x = speed;
	
	// Kollisions-Box
	this.sprite.body.setSize(this.sprite.width, this.sprite.height / 4, 0, 0.375 * this.sprite.height);
	
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
		this.stop();
	},
	
	fallAnimation: function(holePos) {
		this.fall = true;
		this.holePos = holePos;
		this.stop();
		
		// Bewegung ins Loch
		if (this.holePos.x != this.sprite.x || this.holePos.y != this.sprite.y) {
			var normalize = Math.sqrt(Math.pow(this.holePos.x - this.sprite.x, 2) + Math.pow(this.holePos.y - this.sprite.y, 2));
			this.sprite.body.velocity.x = this.speed * (this.holePos.x - this.sprite.x) / normalize;
			this.sprite.body.velocity.y = this.speed * (this.holePos.y - this.sprite.y) / normalize;			
		}
	},
	
	update: function(dt) {
		if (this.kill) {
			// Todes-Animation
			if (this.killFrame) {
				this.sprite.tint = 0xffffff;
			}
			else {
				this.sprite.tint = 0xff0000;
			}
			this.killFrame = !this.killFrame;
		}
		else if (this.fall) {
			// Fall-Animation
			if (this.killFrame) {
				this.sprite.tint = 0xffffff;
			}
			else {
				this.sprite.tint = 0x000000;
			}
			this.killFrame = !this.killFrame;
			
			// stoppen falls Mitte des Lochs erreicht
			if (((this.sprite.body.velocity.x > 0 && this.sprite.x >= this.holePos.x)
						|| (this.sprite.body.velocity.x < 0 && this.sprite.x <= this.holePos.x))
					&& ((this.sprite.body.velocity.y > 0 && this.sprite.y >= this.holePos.y)
						|| (this.sprite.body.velocity.y < 0 && this.sprite.y <= this.holePos.y))) {
				this.stop();
				this.sprite.x = this.holePos.x;
				this.sprite.y = this.holePos.y;
			}
		}
		else {
			// Bewegung
			this.sprite.body.velocity.x = this.speed * this.speedFactor;
			this.position.x = this.sprite.x;
			this.position.y = this.sprite.y;
		}

		if (this.speedFactor != 1) {
			this.factorDuration -= dt;
			if (this.factorDuration < 0) {
				this.speedFactor = 1;
			}
		}
	},
	
	speedUp: function(factor, duration) {
		this.speedFactor *= factor;
		this.factorDuration = duration;
	},
	
	moveUp: function() {
		this.sprite.body.velocity.y = -this.speed * this.speedFactor;
	},
	
	moveDown: function() {
		this.sprite.body.velocity.y = this.speed * this.speedFactor;
	},
	
	stopMove: function() {
		this.sprite.body.velocity.y = 0;
	},
	
	stop: function() {
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
		this.sprite.animations.stop();
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
	this.setHoleColliders();
	
	this.numberTextsSpeed = 100;
}

JackDanger.JackRun421337.World.prototype = {
	setPassage: function() {
		this.passage = {};
		this.passage.start = 1;
		this.passage.end = 12;
	},
	
	setHoleColliders: function() {
		this.holeColliders = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
		for (var x = 0; x < this.map.width; x++) {
			for (var y = this.passage.start; y <= this.passage.end; y++) {
				var tile = this.map.getTile(x,y);
				
				var xPixel = x * this.map.tileWidth;
				var yPixel = y * this.map.tileHeight;
				
				if (tile.index == 37) {
					for (var i = 5; i < this.map.tileWidth; i += 10) {
						var sprite = this.holeColliders.create(xPixel + i, yPixel + this.map.tileHeight + 4 - i);
						this.game.physics.arcade.enable(sprite);
						sprite.body.setSize(1, 2 * (i - 4));
						sprite.body.immovable = true;
					}
					for (var i = this.map.tileWidth - 6; i >= 0; i -= 10) {
						var sprite = this.holeColliders.create(xPixel + this.map.tileWidth + i, yPixel + 5 + i);
						this.game.physics.arcade.enable(sprite);
						sprite.body.setSize(1, 2 * (this.map.tileHeight - 5 - i));
						sprite.body.immovable = true;
					}
					
					var sprite = this.holeColliders.create(xPixel + this.map.tileWidth, yPixel);
					this.game.physics.arcade.enable(sprite);
					sprite.body.setSize(1, 2 * this.map.tileHeight);
					sprite.body.immovable = true;
				}
			}
		}
	},
	
	collectDiamond: function(tile, number) {
		this.replaceTile(tile);
		
		// Text für Nummer erstellen
		var numberText = this.game.add.bitmapText(tile.x * this.map.tileWidth, tile.y * this.map.tileHeight, "testfont", number.toString(), 16);
		
		if (number < 0) {
			numberText.tint = 0xff0000;
		}
		else {
			numberText.tint = 0x00ff00;
		}
		
		numberText.checkWorldBounds = true;
		numberText.events.onOutOfBounds.add(this.destroy, numberText);
		
		this.game.physics.arcade.enable(numberText);
	
		numberText.body.collideWorldBounds = false;
		numberText.body.velocity.y = -this.numberTextsSpeed;
	},
	
	getHolePos: function(holeCollider) {
		var tile = this.map.getTile(Math.floor(holeCollider.x / this.map.tileWidth), Math.floor(holeCollider.y  / this.map.tileHeight));
		
		// Mitte des Lochs ermitteln
		var holePos = {};
		if (tile.index == 36) {
			holePos.x = tile.x * tile.width;
			holePos.y = (tile.y + 1) * tile.height;
		}
		else if (tile.index == 37) {
			holePos.x = (tile.x + 1) * tile.width;
			holePos.y = (tile.y + 1) * tile.height;
		}
		else if (tile.index == 61) {
			holePos.x = tile.x * tile.width;
			holePos.y = tile.y * tile.height;
		}
		else if (tile.index == 62) {
			holePos.x = (tile.x + 1) * tile.width;
			holePos.y = tile.y * tile.height;
		}
		return holePos;
	},
	
	getNextHolePos: function(spritePos, tile) {
		var bestPos = null;
		var minDist = 2 * Math.max(this.map.tileWidth, this.map.tileHeight);
		for (var x = -1; x < 2; x++) {
			for (var y = -1; y < 2; y++) {
				if (x == 0 && y == 0) {
					continue;
				}
				var newTile = this.map.getTile(Math.floor(tile.x / this.map.tileWidth + x), Math.floor(tile.y /  this.map.tileHeight + y));
				if (this.isHoleTile(newTile)) {
					var holePos = this.getHolePos(spritePos, newTile);
					var dist = this.getDistance(spritePos, holePos);
					if (dist < minDist) {
						minDist = dist;
						bestPos = holePos;
					}
				}
			}
		}
		if (bestPos == null) {
			logInfo("Hole position not found!");
		}
		return bestPos;
	},
	
	isHoleTile: function(tile) {
		return tile.index == 36 || tile.index == 37 || tile.index == 61 || tile.index == 62;
	},
	
	getDistance: function(position1, position2) {
		return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
	},
	
	getObjects: function(objectId, key) {
		var group = this.game.add.group();
		this.map.createFromObjects("Objektebene 1", objectId, key, 0, true, false, group);
		return group;
	},
	
	replaceTile: function(tile) {
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
	stop: function() {
		for (var i = 0; i < this.sprites.children.length; i++) {
			this.sprites.children[i].body.velocity.x = 0;
		}
	}
}

/**
 * Spikeballs
 */
JackDanger.JackRun421337.Spikeballs = function(group, speed) {
	this.sprites = group;
	this.speed = speed;
	
	for (var i = 0; i < this.sprites.children.length; i++) {
		var spikeball = this.sprites.children[i];
		game.physics.arcade.enable(spikeball);
		spikeball.body.velocity.y = -this.speed;
		spikeball.body.bounce.setTo(1,1);
		// Kollisions-Box
		var bodyScale = 0.95;
		spikeball.body.setSize(bodyScale * spikeball.width, bodyScale * spikeball.height, (1 - bodyScale) * spikeball.width / 2, (1 - bodyScale) * spikeball.height / 2);
	}
}

JackDanger.JackRun421337.Spikeballs.prototype = {
	stop: function() {
		for (var i = 0; i < this.sprites.children.length; i++) {
			this.sprites.children[i].body.velocity.x = 0;
		}
	}
}

/**
 * HUD
 */
JackDanger.JackRun421337.HUD = function(game) {
	this.numberText = game.add.bitmapText(game.windowWidth / 2, 0, "testfont", "", 32);
	this.numberText.anchor.setTo(0.5, 0);
	this.numberText.fixedToCamera = true;
}

JackDanger.JackRun421337.HUD.prototype = {
	setPoints: function(points, maxPoints) {
		this.numberText.text = points.toString() + " / " + maxPoints;
		if (points == maxPoints) {
			this.numberText.tint = 0x00ff00;			
		}
		else {
			this.numberText.tint = 0xffffff;
		}
	}
}

/**
 * SpritesheetGenerator (https://github.com/suddani/phaser_mini_games/blob/master/games/sudi/src/spritesheet_generator.js)
 */
JackDanger.JackRun421337.SpritesheetGenerator = function(game) {
	this.game = game;
}

JackDanger.JackRun421337.SpritesheetGenerator.prototype = {
	createSpriteSheet: function(atlas_key, frame_name) {
		if (this.game.cache.checkImageKey(frame_name)) {
			//image already loaded
			logInfo("Dont create Spritesheet for: " + frame_name);
			return;
		}
		  
		var frame = this.game.cache.getFrameData(atlas_key).getFrameByName(frame_name);
		var orb = this.game.make.sprite(0, 0, atlas_key, frame.name);
		var bmd = this.game.add.bitmapData(frame.width, frame.height);
		bmd.draw(orb, 0, 0);
		//Check if there is actually more than one frame. otherwise just create this one image
		if (this.game.cache.getFrameData(atlas_key).getFrameByName(frame_name+"_0000"))
			this.game.cache.addSpriteSheet(frame.name, '', bmd.canvas, frame.height, frame.height);
		else
			this.game.cache.addSpriteSheet(frame.name, '', bmd.canvas, 32, 32);
	}
}