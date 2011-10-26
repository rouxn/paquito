/**
 * Paquito network simulation
 * 
 * @version 0.1
 */
var PKT = function () {
	var _frame = FRM;
	var _sender = SDR;
	var _reciever = RCR;
	
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
				default:
					alert(msg);
					break;
			}
		}
	};

	var _test = function () {
		for (var i=0; i < 3; i++) {
			_frame.create(50, 0.4);
			_debug(_frame.id());
			_debug(_frame.checkseq() == _frame.crc());
		}
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
		
		_debug('Initialized');
		
		_test();
	};
	
	// expose public properties and methods
	return {
		init: _init,
	};
}();
