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
addMyGame("jackrun421337", "Jack Run", "Karl_Costa", "Renn vor der Wand weg und sammle Primzahlen, \n2er-Potenzen und andere tolle Zahlen!",
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
}

//wird nach dem laden gestartet
JackDanger.JackRun421337.prototype.create = function() {
	logInfo("create JackRun");
	
    Pad.init();//nicht anfassen
    //removeLoadingScreen();//nicht anfassen
}

JackDanger.JackRun421337.prototype.mycreate = function() {
	var spritesheetGen = new JackDanger.JackRun421337.SpritesheetGenerator(this);
	spritesheetGen.createSpriteSheet("dangers", "SpikeBall2");
	
	this.physics.startSystem(Phaser.Physics.ARCADE);
	
	this.allowedNumbers = [0, 1, 2, 3, 4, 5, 7, 8, 11, 13, 16, 17, 19, 23, 29, 31, 32, 37, 41, 42, 43, 47, 53, 59, 61, 64, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 128, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 256, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 512, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1024, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223, 1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1337, 1361, 1367, 1373, 1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511, 1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657, 1663, 1667, 1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 1783, 1787, 1789, 1801, 1811, 1823, 1831, 1847, 1861, 1867, 1871, 1873, 1877, 1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987, 1993, 1997, 1999];
	
	this.stage.backgroundColor = 0x000000;
	this.windowWidth = game.width;
	this.windowHeight = game.height;
	this.lose = false;
	this.speed = 200;
	this.number = -1;
	
	this.jackOffset = 64;
	var jackPos = {};
	jackPos.x = this.jackOffset;
	jackPos.y = 50;
	
	// Welt laden
	this.world = new JackDanger.JackRun421337.World(this);
	
	// Gefahren laden
	this.spikes = new JackDanger.JackRun421337.Spikes(this, this.world, this.speed);
	var group = this.world.getObjects("SpikeBall", "SpikeBall2");
	this.spikeballs = new JackDanger.JackRun421337.Spikeballs(group, this.speed);
	
	// Jack laden
	this.jack  = new JackDanger.JackRun421337.Jack(this, jackPos, this.speed);
	// HUD laden
	this.hud = new JackDanger.JackRun421337.HUD(this);
	
	this.world.map.setTileIndexCallback([67,68,92,93], this.collectDiamond, this);
	this.world.map.setTileIndexCallback([36, 37, 61, 62], this.holeDeath, this);
	
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
		// Spieler-Steuerung
		this.playerControls();
		
		// Kamera bewegen
		this.camera.x = this.jack.position.x - this.jackOffset;		
		
		// Kollisions-Erkennung
		this.physics.arcade.collide(this.jack.sprite, this.world.layer);
		this.physics.arcade.overlap(this.jack.sprite, this.spikes.sprites, this.spikesDeath, null, this);
		this.physics.arcade.overlap(this.jack.sprite, this.spikeballs.sprites, this.spikesDeath, null, this);
		this.physics.arcade.collide(this.spikeballs.sprites, this.world.layer);
	}
	
	// Jack bewegen
	this.jack.update(dt);
}

JackDanger.JackRun421337.prototype.render = function() {
	if (this.jack != null) {
		//game.debug.body(this.jack.sprite);
	}
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
	
	// Beschleunigung x-Achse
	if (Pad.justDown(Pad.JUMP)) {
		if (this.number != -1) {
			if (this.allowedNumbers.indexOf(this.number) != -1) {
				this.jack.speedUp(2, 1);
				this.hud.goodNumber();
			}
			else {
				this.jack.speedUp(0.5, 1);
				this.hud.badNumber();
			}
			
			this.number != -1;
		}
	}
}

JackDanger.JackRun421337.prototype.collectDiamond = function(sprite, tile) {
	if (sprite === this.jack.sprite) {
		this.number = this.randomIntFromInterval(0,2000);
		this.world.collectDiamond(tile, this.number);
		this.hud.setNumber(this.number);
	}
}

JackDanger.JackRun421337.prototype.holeDeath = function(sprite, tile) {
	logInfo("fall");
	if (!this.lose) {
		if (sprite === this.jack.sprite) {
			this.lose = true;
			this.loseCounter = 20;
			
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
			else {
				holePos.x = (tile.x + 1) * tile.width;
				holePos.y = tile.y * tile.height;
			}
			this.jack.fallAnimation(holePos);
			this.spikes.stop();
			this.spikeballs.stop();
		}
	}
}

JackDanger.JackRun421337.prototype.spikesDeath = function(sprite, tile) {
	// starte Verloren-Animation
	if (!this.lose) {
		this.lose = true;
		this.loseCounter = 10;
		this.jack.killAnimation();
		this.spikes.stop();
		this.spikeballs.stop();
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
			logInfo("factorDuration: " + this.factorDuration);
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
	setNumber: function(number) {
		this.numberText.tint = 0xffffff;
		this.numberText.text = number.toString();
	},
	
	goodNumber: function() {
		this.numberText.tint = 0x00ff00;
	},
	
	badNumber: function() {
		this.numberText.tint = 0xff0000;
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