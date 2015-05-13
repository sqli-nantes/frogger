var FROGGER_SQLI = FROGGER_SQLI || function(){
	
	function init(){		
		var socket = io();
		socket.on('connection', function (data) {
		    console.log(data);
		});

		var soundElemnt = document.querySelector('.sound');
		soundElemnt.addEventListener('click', function(){
			soundElemnt.classList.toggle('off');
			if (soundElemnt.classList.contains('off')){
				theme.pause();
			}else{
				theme.play();
			}
			
		});

		//var audio = document.querySelector('audio');
		setTimeout(function() {
			theme.pause();
		}, 1000);
	}

	init();


	return{};
}();