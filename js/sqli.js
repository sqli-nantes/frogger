var FROGGER_SQLI = FROGGER_SQLI || function(){
	
	var socket = null,
		timeStep = 0,
		step1 = false,
		step2 = false,
		step3 = false,
		lastMax = 0,
		boing = false,
		touch = {},
		currentLogin = 'anonymous'
		top10 = [],
		gameStart = true;

	function init(){		
		socket = io();
		socket.on('connection', function (data) {
		    console.log(data);
		});		

		window.addEventListener('load', checkConfiguration);
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
			gameStart = true;
			document.querySelector('#classement').style.display= 'none';
			game.lives = 5;
			game.score = 0;
			game.level = 1;
			game.reset();
			socket.emit('message',{action : 'start'});
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
			}else if (message.action && message.action === 'left'){
				left();
			}else if (message.action && message.action === 'right'){
				right();
			}else if (message.login){
				currentLogin = message.login;
			}
		});
	}

	function motionCallBack(motion){
		/* 
		Un saut suit une courbe d'acceleration de Y comme suit : 
			Etape 1. : l'accélération dépasse 10 en valeur absolue (on est dans la montée)
			Etape 2. : L'accélération s'arrete 
			Etape 3 : L'accélération va dépasser 10 en valeur absolue (on est dans la descente)
			Etape 4 : l'accélération s'arrete (on a finit notre mouvement)
		*/

		var data = Math.abs(motion.accelerationIncludingGravity.y);
		//console.warn("Acc : %s",data);
		if (data > 10){				
			timeStep = new Date().getTime();
			if (lastMax < data){
				lastMax = data;
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
	}

	function touchCallBack(event){
		event.preventDefault();
		if (event.type === 'touchstart'){
			touch = event.changedTouches[0];
		}else if (event.type === 'touchend'){
			var touchTmp = event.changedTouches[0];

				// On doit inverser les données et on ne s'occuper que du X
				/* 
				  Dans ce schema le smartphone nous fait fasse
				 y
				 ^      -----
				 |     |	 |		
				 |     |     |
				 |     |     |
				 |      -----
				 0------------> x
				 
				Xstart - Xend < 0 
					=> On glisse le doigt vers la droite 
					=> On veut aller à gauche dans le jeux

				*/
			if (touch.clientX - touchTmp.clientX < 0){
				socket.emit('message',{
					action : "left"
				});
			}else{
				socket.emit('message',{
					action : "right"
				});
			}
		}
		console.log(event);
	}

	function initPhone(){
		window.addEventListener('devicemotion', motionCallBack, true);
		document.querySelector('.touch-area').addEventListener('touchstart', touchCallBack, false);
		document.querySelector('.touch-area').addEventListener('touchend', touchCallBack, false);

		var validateElement = document.querySelector('.validate');
		var loginElement = document.querySelector('input');
		validateElement.addEventListener('click', function(){
			var loginValue = loginElement.value;
			if (loginValue.length > 0 && !loginElement.disabled){
				socket.emit('message', {login : loginValue});
				validateElement.setAttribute('disabled',true);
				loginElement.setAttribute('disabled',true);
				document.querySelector('.parent').style.display = 'none';
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

		socket.on('message', function(message){
			if (message.action && message.action === 'start'){
				validateElement.removeAttribute('disabled');
				loginElement.removeAttribute('disabled');
				loginElement.value = '';
				document.querySelector('.parent').style.display = '';
			}
		});
	}

	function game_over(){
		if (!gameStart){
			return;
		}
		gameStart = false;
		document.querySelector('#classement').style.display= '';
		var scores = localStorage.getItem('scores');
		if (!scores){
			scores = {};
		}else{
			scores = JSON.parse(scores);
		}
		var loginModified = currentLogin.trim().replace(' ','_').toUpperCase();
		scores[loginModified] = game.score;

		top10 = [];
		var keys = Object.keys(scores);
		for (key in scores){
			if (scores.hasOwnProperty(key)){
				var scoreTmp = scores[key];
				if (top10.length < 10 || top10[9].score < scoreTmp){
					top10.push({login : key, score : scoreTmp});
				}
				for (var i = top10.length-1; i > 0; i--){
					if (top10[i].score > top10[i-1].score){
						var sauvTemp = top10[i-1];
						top10[i-1] = top10[i];
						top10[i] = sauvTemp;
					}
				}

				top10 = top10.slice(0,10);
			}
		}

		var scoreElt = document.querySelector('#classement .scores_parent .scores');
		var contentHtml = '';
		for (topKey in top10){
			contentHtml += "<div class='rank'>"+(+topKey+1)+"</div>"
			+"<div class='login'>"+top10[topKey].login+"</div>"
			+"<div class='score'>"+top10[topKey].score+"</div>";
		}
		scoreElt.innerHTML = contentHtml;

		document.querySelector('.game_over .user').innerHTML = currentLogin+" : "+game.score;


		localStorage.setItem('scores', JSON.stringify(scores));
		
	}

	init();


	return{
		game_over: game_over
	};
}();