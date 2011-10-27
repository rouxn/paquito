/**
 * Paquito network simulation
 * 
 * @version 0.1
 */
var PKT = function () {
	var _frame = FRM;
	var _sender = host();
	var _receiver = host();
	
	var _settings = {
		debug: true, // output debug info
		debugMode: 'console', // debug output method ('console' or 'alert')
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

	var _test = function () {
		_sender.errorRate(0.4);
		
		_sender.send();
	};
	
	/**
	 * Initialize Paquito
	 * @param {Object} settings
	 */
	var _init = function(settings) {
		for(attr in settings) {
			_settings[attr] = settings[attr];
		}

		_frame.debug(_debug);

		_sender.debug(_debug);
		_sender.isSender(true);
		_sender.receiver(_receiver);
		_sender.frameObject(_frame);
		_sender.frameLength(3000000);
		_sender.bandwidth(0.00000000000000001);
		
		_receiver.debug(_debug);
		_receiver.receiver(_sender);
		_receiver.frameObject(_frame);
		_receiver.bandwidth(56 * Math.pow(2, 10));
		
		_debug('Initialized');
		
		_test();
	};
	
	// expose public properties and methods
	return {
		init: _init,
	};
}();
