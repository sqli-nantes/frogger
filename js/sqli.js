var FROGGER_SQLI = FROGGER_SQLI || function(){
	
	var socket = null,
		timeStep = 0,
		trackMovement = false,
		backMovement = false,
		sendEvent = false;

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

		socket.on('message', function(message){
			if (message.action && message.action === 'jump'){
				up();
			}
		});
	}

	function initPhone(){
		window.addEventListener('devicemotion', function(motion){
			/*console.info("Acc : %d/%d/%d | Acc Gravity %d/%d/%d ",
				motion.acceleration.x, 
				motion.acceleration.y, 
				motion.acceleration.z, 
				motion.accelerationIncludingGravity.x,
				motion.accelerationIncludingGravity.y,
				motion.accelerationIncludingGravity.z
				);*/
			var data = motion.acceleration.y;
			//console.log("Acc : %s",data);
			if (data > 8){
				if (!trackMovement){					
					trackMovement = true;
					console.info("Track Movement Acc : %s ",data);					
				}else if (sendEvent && !backMovement){
					console.info("Back Movement Acc : %s ",data);					
					backMovement = true;
				}
			}else if (trackMovement && !sendEvent && data < 0){
				timeStep = new Date().getTime();
				sendEvent = true;
				console.info("Send jump instruction ");					
				socket.emit('message',{action: 'jump'});
			}else if (trackMovement && sendEvent && backMovement && data < 1){
				console.info("Reset ");					
				trackMovement = false;
				backMovement = false;
				sendEvent = false;
			}
		}, true);

		setInterval(function(){
			if (trackMovement){
				var timestamp = new Date().getTime();
				if (timestamp - timeStep > 1000){
					backMovement = false;
					trackMovement = false;
					sendEvent = false;
				}
			}
		},1000);
	}

	init();


	return{};
}();