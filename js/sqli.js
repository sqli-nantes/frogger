var FROGGER_SQLI = FROGGER_SQLI || function(){
	
	var socket = null,
		timeStep = 0,
		step1 = false,
		step2 = false,
		step3 = false,
		lastMax = 0,
		boing = false;

	function init(){		
		socket = io();
		socket.on('connection', function (data) {
		    console.log(data);
		});		

		checkConfiguration();		
	}

	function checkConfiguration(){
		if (document.querySelector('.sound')){
			initGame();
		}else{
			initPhone();
		}
	}

	function initGame(){
		var soundElemnt = document.querySelector('.sound');
		soundElemnt.addEventListener('click', function(){
			soundElemnt.classList.toggle('off');
			if (soundElemnt.classList.contains('off')){
				theme.pause();
			}else{
				theme.play();
			}
			
		});

		var resetElemnt = document.querySelector('.reset');
		resetElemnt.addEventListener('click', function(){
			game.lives = 5;
			game.score = 0;
			game.level = 1;
			game.reset();
		});

		boing = document.createElement('audio');
	    boing.setAttribute('src', 'assets/boing.wav');
	    boing.loop = false;

		socket.on('message', function(message){
			if (message.action && message.action === 'jump'){
				boing.currentTime = 0;
				boing.play();
				boing.loop = false;
				up();
			}
		});
	}

	function initPhone(){
		window.addEventListener('devicemotion', function(motion){
			
			/* 
			Un saut suit une courbe d'acceleration de Y comme suit : 
				Etape 1. : l'accélération dépasse 10 en valeur absolue (on est dans la montée)
				Etape 2. : L'accélération s'arrete 
				Etape 3 : L'accélération va dépasser 10 en valeur absolue (on est dans la descente)
				Etape 4 : l'accélération s'arrete (on a finit notre mouvement)
			*/



			var dataY = Math.abs(motion.acceleration.y);
			var dataX = Math.abs(motion.acceleration.x);
			//console.warn("Acc : %s",dataY);
			if (dataY > 10){				
				timeStep = new Date().getTime();
				if (lastMax < dataY){
					lastMax = dataY;
				}else if (!step1){
					step1 =  true;
					socket.emit('message',{
						action : "jump"
					});
					console.info('Jump');
				}else if (step2 && !step3){
					step3 = true;
				}
			}else if (step1){
				lastMax = 0;
				if (!step2){
					step2 = true;
				}else if (step3){					
					//console.info('Reset');
					step1 = false;
					step2 = false;
					step3 = false;					
				}
			}

			if (!step1){
				console.info("Move x : %s ",dataX);
			}


			
		}, true);

		var validateElemnt = document.querySelector('.validate');
		validateElemnt.addEventListener('click', function(){
			var loginValue = document.querySelector('input').value;
			if (loginValue.length > 0 ){
				socket.emit('message', {login : loginValue});
			}
			
		});

		setInterval(function(){
			if (step1){
				var timestamp = new Date().getTime();
				if (timestamp - timeStep > 1000){
					console.info("Clear ");			
					// S'il ne s'est rien passé depuis 1 seconde, alors on réinitialise tout
					step1 = false;
					step2 = false;
					step3 = false;
					lastMax = 0;
				}
			}
		},1000);
	}

	init();


	return{};
}();