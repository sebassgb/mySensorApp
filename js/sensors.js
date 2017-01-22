var app={
  init: function(){
        DIAMETER_BALL=50;
        dificulty=0;
        velocityX=0;
        velocityY=0;
        score=0;

        height = document.documentElement.clientHeight;
        width =  document.documentElement.clientWidth;

        app.guardSensors();
        app.initGame();
      },

    initGame: function(){

      function preload() {
        game.physics.startSystem(Phaser.Physics.ARCADE);//Arrancamos el motor de física
        game.stage.backgroundColor = '#f15d8c';
        game.load.image('ball', 'assets/ball.png');
        game.load.image('aim', 'assets/aim.png');//Cargamos imagen que genera puntos
      }

      function create() {//Funciones enviadas como parametros deben contener los parentesis
        scoreText = game.add.text(16,16, score, { fontSize: '100px', fill: '#757676'});

        aim = game.add.sprite(app.initX(), app.initY(), 'aim');//Usamos el algoritmo para poner la bola(DEBE TENER MISMO TAMAÑO)
        ball = game.add.sprite(app.initX(), app.initY(), 'ball');

        game.physics.arcade.enable(ball);//en el motor de física arcade ponga la bola(sobre el sprite bola actúe las leyes físicas de arcade)
        game.physics.arcade.enable(aim);//Generador de puntos

        ball.body.collideWorldBounds = true;//Cuerpo de la bola detecta colisión
        ball.body.onWorldBounds = new Phaser.Signal();//Cada vez que suceda genera señal(permite poner el manejador de la señal)
        ball.body.onWorldBounds.add(app.reduceScore, this);
      }//Añadimos un sprite

      function update(){
        var dificultyFactor = (300 + (dificulty * 100));//Aumenta velocidad
        ball.body.velocity.y = (velocityY * dificultyFactor);//Mapeo 300 hace interesante el juego
        ball.body.velocity.x = (velocityX * (-1 * dificultyFactor));//Invertir Movilidad en el eje x

        game.physics.arcade.overlap(ball, aim, app.addScore, null, this);
      }//Overlap nos detecta que la BOLA pasa SOBRE(se cruzan) el OBJETIVO, y lanze el callback addScore
//En "null" iría cuando queremos ponerle otra condición, y el THIS es en el entorno que se envía
      var states = { preload: preload, create: create, update: update };
      var game = new Phaser.Game(width, height, Phaser.CANVAS, 'phaser', states);//Creamos un nuevo Game de Phaser
},

      reduceScore: function(){
        score = score-1;
        scoreText.text = score;//Dibuja en el fondo del espacio la puntuación
      }

      addScore: function(){
        score = score+1;
        scoreText.text = score;//Dibuja en el fondo del espacio la puntuación

        aim.body.x = app.initX();
        aim.body.y = app.initY();//Reposicionamos objetivo

        if(score > 0){
          dificulty = dificulty + 1;
        }
      },

      initX: function(){//Cada vez se carga es situaciones diferentes
      return app.numRandomTill(width - DIAMETER_BALL);
    },

      initY: function(){//Cada vez se carga es situaciones diferentes
        return app.numRandomTill(height - DIAMETER_BALL);
      },

      numRandomTill: function(boundary){
        return Math.floor(Math.random() * boundary);
      },

    guardSensors: function(){

      function onError() {
        console.log('onError');
      }
/*Por intervalos leemos datos de acceleración, si hay éxito llamamos onSuccess, con frecuencia en milisegundos*/
  onSuccess: function(dateAcceleration){
    app.detectShaking(dateAcceleration);//Detecta agitación después de analizar datos
    //app.representValues(dateAcceleration); Primera fase
    app.regDirection(dateAcceleration);
  }
    navigator.accelerometer.watchAcceleration(this.onSuccess, onError,{ frequency: 10 });//0.01 seg
  },

    detectShaking: function(dateAcceleration){
      shakingX = Math.abs(dateAcceleration.x) > 10;
      shakingY = Math.abs(dateAcceleration.y) > 10;

      if (shakingX || shakingY) {
        setTimeout(app.restart, 1000);//Dentro de éste tiempo recomienza
      }
    },

    restart: function(){
      document.location.reload(true);//Como es una página web podemos hacer recarga de página
    },

    regDirection: function(dateAcceleration){
      velocityY = dateAcceleration.y ;
      velocityX = dateAcceleration.x ;

    }
/*Primera fase aplicación
  representValues: function(dateAcceleration){
    app.represent(dateAcceleration.x, '#valuex');
    app.represent(dateAcceleration.y, '#valuey');
    app.represent(dateAcceleration.z, '#valuez');
  },
  represent: function(dates, elementHTML){
    var rounded = Math.round(dates * 100) / 100;
    document.querySelector(elementHTML).innerHTML = rounded;
  }/*El innerHTML del SPAN agregado le introducimos el valor*/
};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.init();/*deviceready nos dice que ya esta disponible el accelerometro*/
    }, false);/*'DOMContentLoaded'*/
}
