var FROGGER_SQLI = FROGGER_SQLI || function(){
	
	function init(){		
		var socket = io();
		socket.on('connection', function (data) {
		    console.log(data);
		});
	}

	init();


	return{};
}();