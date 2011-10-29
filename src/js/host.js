/**
 * Send or receive frames. Simulate transmission time. 
 */
function host() {
	var _output; // Output function
	var _c = 2.3 * Math.pow (10,8); // Light speed in copper 
	var _stats = STS;

	var _properties = {
		sender: false, // Do we are sender or receiver?
		receiver: null, // Where do we send frame
		frameLength: 1000, // Assign static frame length
		distance: 2000, // Distance between sender and receiver
		frameInterval: 10, // Interval between frames
		frameLoss: 0.1, // Percents of lost frame in transmission
		errorRate: 0.4, // Percents of error when sending a frame
		bandwith:0, // Bandwidth between links in bits/s 
	};
	
	/**
	 * Send a frame to a the defined receiver
	 * 
	 * @param {Integer} frameLength
	 * @param {Integer} numFrame
	 */
	var _send = function (frameLength, numFrame) {
		if (numFrame < 1) {
			return;
		}
		
		var length = frameLength || _properties.frameLength;
		var _frame = frame();
		
		_frame.create(length, _properties.errorRate);
		
		_output('Frame #' + _frame.id() + ' sended' );
		_stats.frameSended();
		
		if (Math.random() > _properties.frameLoss) {
			_properties.receiver.receive(_frame);							
		}
		
		setTimeout(function () {
			_send(frameLength, numFrame-1);
		}, _properties.frameInterval);
		
	};
	
	/**
	 * Receive a frame from a sender
	 * 
	 * @param frame Received frame
	 */
	var _receive = function(frame) {
		setTimeout(function () {
			var haveError = (frame.crc() == frame.checkseq()) ? null : 'error';
			_output('Received frame #' + frame.id (), haveError);
			_stats.frameReceived(haveError);
		}, _delay());
	};
	
	/**
	 * Compute the delay to send a packet between hosts
	 * 
	 * @returns {Integer}  Transmit delay
	 */
	var _delay = function (){
		var propagationTime = _properties.distance / _c;
		var transmitTime = _properties.frameLength / _properties.bandwith;
		return propagationTime + transmitTime;
	};

	var _receiver = function (receiver) {
		if (receiver != null) {
			_properties.receiver = receiver;
		} else {
			return _properties.reciever;
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
	
	var _setOutput = function (output) {
		_output = output;
	};
	
	return {
		output: _setOutput,
		send: _send,
		receiver: _receiver,
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
