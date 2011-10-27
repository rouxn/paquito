/**
 * 
 */
function host() {
	var _debug;

	this._properties = {
		sender: false,
		receiver: null,
		frameObj: null,
		frameLength: 1000, // Assign static frame length
		distance: 2000, // Distance between sender and receiver
		frameInterval: 10,
		frameLoss: 0.1,
		errorRate: 0.4,
		bandwith:0,
	};
	
	var _c = 2.3 * Math.pow (10,8);
	
	var _send = function (frameLength) {
		var length = frameLength || _properties.frameLength;
		
		_properties.frameObj.create(length, _properties.errorRate);
		
		setTimeout ('_properties.receiver.receive(_properties.frameObj)',_delay());
		
	};
	
	var _receiver = function (receiver) {
		if (receiver != null) {
			_properties.receiver = receiver;
		} else {
			return _properties.reciever;
		}
	};
	
	var _frameObject = function (object) {
		if (object != null) {
			_properties.frameObj = object;
		} else {
			return _properties.frameObj;
		}
	};
	
	var _frameLength = function (length) {
		if (length != null) {
			_properties.frameLength = length;
		} else {
			return _properties.frameLength;
		}
	};
	
	var _distance = function (length) {
		if (length != null) {
			_properties.distance = length;
		} else {
			return _properties.distance;
		}
	};
	
	var _frameInterval = function (interval) {
		if (interval != null) {
			_properties.frameInterval = interval;
		} else {
			return _properties.frameInterval;
		}
	};
	
	var _frameLoss = function (loss) {
		if (loss != null) {
			_properties.frameLoss = loss;
		} else {
			return _properties.frameLoss;
		}
	};
	
	var _errorRate = function (rate) {
		if (rate != null) {
			_properties.errorRate = rate;
		} else {
			return _properties.errorRate;
		}
	};
	
	var _isSender = function (sender) {
		if (sender != null) {
			_properties.sender = sender;
		} else {
			return _properties.sender;
		}
	}; 
	
	var _bandwidth = function (bandwidth){
		if( bandwidth != null ) {
			_properties.bandwith = bandwidth ;
		}
		else {
			return _properties.bandwith ;
		}
		
	};
	
	/**
	 * Set debugger
	 * 
	 * @param {Object} debug
	 */
	var _setDebugger = function (debug) {
		_debug = debug;
	};
	
	var _delay = function (){
		var propagationTime = _properties.distance/_c ;
		var transmitTime = _properties.frameLength / _properties.bandwith ;
		return propagationTime + transmitTime ;
	};
	
	var _receive = function (frame ) {
		_debug ('Frame receive ID number : ' + frame.id ());
		_debug ('Frame error ' + !(frame.checkseq () == frame.crc ()));
		_debug('Frame length ' + frame.payload().length);
	};
	
	return {
		debug: _setDebugger,
		send: _send,
		receiver: _receiver,
		frameObject: _frameObject,
		frameLength: _frameLength,
		errorRate: _errorRate,
		distance: _distance,
		frameInterval: _frameInterval,
		frameLoss: _frameLoss,
		isSender: _isSender,
		bandwidth: _bandwidth,
		receive: _receive,
	};
}
