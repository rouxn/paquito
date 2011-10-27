/**
 * Paquito network simulation
 * 
 * @version 0.1
 */
var PKT = function () {
	var _sender = host();
	var _receiver = host();
	
	var _settings = {
		debug: true, // output debug info
		debugMode: 'console', // debug output method ('console', 'html' or 'alert')
	};
	
	
	/**
	 * @returns {Integer} Timestamp
	 */
	var _timestamp = function () {
		return new Date().getTime();
	};
	
	/**
	 * Output Paquito debug information
	 * @param {String} msg Message to print
	 */
	var _debug = function(msg) {
		msg = 'Paquito: ' + msg;
		if(_settings.debug)
		{
			switch(_settings.debugMode) {
				case 'alert':
					alert(msg);
					break;
				case 'console':
					console.log(msg);
					break;
				case 'html':
					$('body').append(msg+'<br />');
					break;
				default:
					alert(msg);
					break;
			}
		}
	};

	/**
	 * Test the system!
	 */
	var _test = function () {
		_receiver.bandwidth(56 * Math.pow(2, 10));

		_sender.errorRate(0.4);
		_sender.frameLength(3000);
		_sender.frameInterval(500);
		
		_receiver.distance(10000);
		_receiver.bandwidth(5);
		
		_sender.send(null, 20);
	};
	
	var _senderOut = function (msg) {
		$('#sender').append('<li>(' + _timestamp() + ') ' + msg + '</li>');
	};
	
	var _receiverOut = function (msg) {
		$('#receiver').append('<li>(' + _timestamp() + ') ' + msg + '</li>');
	};

	/**
	 * Initialize Paquito
	 * @param {Object} settings
	 */
	var _init = function(settings) {
		for(attr in settings) {
			_settings[attr] = settings[attr];
		}

		
		_sender.output(_senderOut);
		_sender.isSender(true);
		_sender.receiver(_receiver);
		
		_receiver.output(_receiverOut);
		_receiver.receiver(_sender);
		
//		_debug('Initialized');
		
		_test();
	};
	
	// expose public properties and methods
	return {
		init: _init,
	};
}();
