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
	
	this.speed = 200;
	this.timeText = game.add.bitmapText(game.width / 2, 20, "testfont", "", 30);
	this.timeText.anchor.set(0.5);
	
	this.jackOffset = 50;
	var jackPos = {};
	jackPos.x = this.jackOffset;
	jackPos.y = 50;
	
	this.world = new JackDanger.JackRun421337.World(this);
	this.jack  = new JackDanger.JackRun421337.Jack(this, jackPos, this.speed);
	
	this.physics.setBoundsToWorld();
	
	this.camera.x = game.width / 2;
	this.camera.y = game.height / 2;
}

//wird jeden Frame aufgerufen
JackDanger.JackRun421337.prototype.update = function() {
	logInfo("update JackRun");
	
    var dt = this.time.physicsElapsedMS * 0.001;
	
	// Jack bewegen
	this.jack.update();
	// Kamera bewegen
	this.camera.x = this.jack.position.x - this.jackOffset;
	
	this.physics.arcade.collide(this.jack.sprite, this.world.layer);
}

/////////////////////////////////////////////////////////
// Zeug das zum Spiel gehört, das kannst du alles ///////
// Löschen oder ändern oder was weiß ich ////////////////
/////////////////////////////////////////////////////////

/**
 *	Klasse Jack
 */
JackDanger.JackRun421337.Jack = function(game, position, speed) {
	logInfo("generate Jack");
	
	this.position = position;
	this.sprite = game.add.sprite(this.position.x, this.position.y, "jack", "jack_rechts0");
	
	this.sprite.checkWorldBounds = true;
	this.sprite.events.onOutOfBounds.add(onVictory);
	
	game.physics.arcade.enable(this.sprite);
	
	this.sprite.body.collideWorldBounds = false;
	this.sprite.body.velocity.x = speed;
	
	this.speed = speed;
	
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
	
	update: function() {
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
}

/**
 * Klase World
 */
JackDanger.JackRun421337.World = function(game) {
	logInfo("generate world");
	
	this.map = game.add.tilemap("map");
	this.map.addTilesetImage("epyx_JDanger_tiles", "tiles");
	this.map.setCollision(226);
	this.layer = this.map.createLayer("Kachelebene 1", 800, 450);
	this.layer.resizeWorld();
}