var FROGGER_SQLI = FROGGER_SQLI || function(){
	
	var socket = null,
		timeStep = 0;

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
			if (data > 8){
				var timestamp = new Date().getTime();
				if (timestamp - timeStep > 500){
					timeStep = timestamp;
					socket.emit('message',{action: 'jump'})	;
					console.info("Acc : %s ",data);
				}
			}
		}, true);
	}

	init();


	return{};
}();