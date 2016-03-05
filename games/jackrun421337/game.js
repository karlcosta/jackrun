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
	
	this.world = new JackDanger.JackRun421337.World(this);
	this.jack  = new JackDanger.JackRun421337.Jack(this, this.speed);
}

//wird jeden Frame aufgerufen
JackDanger.JackRun421337.prototype.update = function() {
	logInfo("update JackRun");
	
    var dt = this.time.physicsElapsedMS * 0.001;

	this.jack.update();
}

/////////////////////////////////////////////////////////
// Zeug das zum Spiel gehört, das kannst du alles ///////
// Löschen oder ändern oder was weiß ich ////////////////
/////////////////////////////////////////////////////////

/**
 *	Klasse Jack
 */
JackDanger.JackRun421337.Jack = function(game, speed) {
	logInfo("generate Jack")
	this.sprite = game.add.sprite(50,50, "jack", "jack_rechts0");
	
	game.physics.arcade.enable(this.sprite);
	
	this.sprite.body.collideWorldBounds = true;
	this.sprite.body.velocity.x = speed;
	
	game.camera.follow(this.sprite);
	
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
	}
}

/**
 * Klase World
 */
JackDanger.JackRun421337.World = function(game) {
	logInfo("generate world");
	
	this.camera = game.camera;
	this.map = game.add.tilemap("map");
	this.map.addTilesetImage("epyx_JDanger_tiles", "tiles");
	this.layer = this.map.createLayer("Kachelebene 1", 800, 450);
	this.layer.resizeWorld();
}