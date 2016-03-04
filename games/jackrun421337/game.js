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
	
    //füge hie rein was du alles laden musst.
    this.load.atlas("jack");
	this.load.atlas("world");
	this.map = {};
	this.map.rows = 10;
	this.map.data = [0,0,0,0,0,0,0,0,0,0,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1,
					 1,1,1,1,1,1,1,1,1,1];
}

//wird nach dem laden gestartet
JackDanger.JackRun421337.prototype.create = function() {
	logInfo("create JackRun");
	
    Pad.init();//nicht anfassen
    removeLoadingScreen();//nicht anfassen
	
	this.stage.backgroundColor = 0x000000;
	this.world = new JackDanger.JackRun421337.World(this, this.map);
	this.jack  = new JackDanger.JackRun421337.Jack(this);

    this.addStuff();
}

//wird jeden Frame aufgerufen
JackDanger.JackRun421337.prototype.update = function() {
	logInfo("update JackRun");
	
    var dt = this.time.physicsElapsedMS * 0.001;

	this.world.move(this.speed * dt);
    /*this.playerControls(dt);
    this.updateBall(dt);
    this.bounding();
    this.collision();
    this.updateTime(dt);*/
}

/////////////////////////////////////////////////////////
// Zeug das zum Spiel gehört, das kannst du alles ///////
// Löschen oder ändern oder was weiß ich ////////////////
/////////////////////////////////////////////////////////

/**
 * Klasse JackRun421337
 */
JackDanger.JackRun421337.prototype.addStuff = function(dt) {
	this.worldOffset = 0;
	this.wallOffset = 0;
	
	this.speed = 200;

	this.timeText = game.add.bitmapText(game.width / 2, 20, "testfont", "", 30);
	this.timeText.anchor.set(0.5);
	
}

JackDanger.JackRun421337.prototype.playerControls = function(dt) {
	if (Pad.isDown(Pad.UP)) {
		this.jack.moveUp(this.speed * dt);
	}

	if (Pad.isDown(Pad.DOWN)) {
		this.jack.moveDown(this.speed * dt);
	}
}

/**
 *	Klasse Jack
 */
JackDanger.JackRun421337.Jack = function(game) {
	logInfo("generate Jack")
	this.sprite = game.add.sprite(50,50, "jack", "jack1.png");
	this.sprite.scale.setTo(0.2, 0.2);
	this.setAnimations();
	this.doAnimation("run");
}

JackDanger.JackRun421337.Jack.prototype = {
	setAnimations: function() {
		// TODO
		this.sprite.animations.add("run", ["jack1.png", "jack2.png", "jack1.png", "jack0.png"], 12, true, false);
	},
	
	doAnimation: function(name) {
		// TODO
		//this.sprite.animations.play(name);
	},
	
	moveUp: function(dist) {
		this.sprite.y -= dist;
	},
	
	moveDown: function(dist) {
		this.sprite.y += dist;
	}
}

/**
 * Klase World
 */
JackDanger.JackRun421337.World = function(game, map) {
	logInfo("generate world");
	// generate sprites
	this.sprites = [];
	for (var i = 0; i < map.data.length; i++) {
		var positionX = Math.floor(i / map.rows) * game.game.height / map.rows;
		var positionY = (i % map.rows) * game.game.height / map.rows;
		var sprite = null;
		if (map.data[i] == 1)
			sprite = game.add.sprite(positionX, positionY, "world", "ground.png");
		
		if (sprite != null) {
			var scale = game.game.height / (map.rows * sprite.height);
			sprite.scale.setTo(scale, scale);
			this.sprites.push(sprite);
		}
	}
}
 
JackDanger.JackRun421337.World.prototype = {
	move: function(dist) {
		for (var i = 0; i < this.sprites.length; i++) {
			var sprite = this.sprites[i];
			sprite.x -= dist;
		}
	}
}