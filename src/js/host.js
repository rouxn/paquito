function Host(hostId, link) {
	var _c = 2.3 * Math.pow (10,8); // Light speed in copper 
	var _outbox = $('#host-'+hostId+' ul');
	var bitRates = { // TODO: Use bit rate
			video: _nextVideoPacketInterval,
			audio: _nextAudioPacketInterval,
	};
	var SENSE_DURATION = 0.000096;
		
	var _properties = {
		id: hostId,
		link: link,
		packetPayload: 0,
		hostDistance: 0, // Consecutive host distance
		packetInterval: 0,
		errorRate: 0, // Percents of error when sending a packet
		bandwith: 0, // Bandwidth between links in bits/s
		dataSize: 0, // Size of the data to send
		numPackets: 0, // Number of packets sent
		receiver: 0,
		distance: 0, // Distance to the current receiver
		hosts: [], // Host on the networks
		linkIdle: true,
		jam: false, // JAM signal receive
		sendingUntil: 0,
		lastPacketId: 0,
		resentLast: false,
		connected: false,
		backoffCoeff: 0,
		jamSignal: 0,
	};
	
	/**
	 * Sense network before sending a packet
	 * 
	 * @param {Integer} duration Optional sensing duration
	 */
	var _sense = function (duration) {
		if (_properties.numPackets <= 0) {
			return;
		}

		if (!duration) {
			_properties.backoffCoeff = 0;
			_properties.jamSignal = 0;
			duration = CLOCK + SENSE_DURATION;
		}
		
		link.push(_properties.hosts[_properties.id-1], duration, 'sense');
	};
	
	/**
	 * Send a packet to a the defined receiver
	 */
	var _send = function () {
		if (_properties.linkIdle) {
			var packet = Packet();
			packet.create(_properties.hosts[_properties.id-1],
						  _properties.hosts[_properties.receiver], 
						  _properties.packetPayload, 
						  _properties.errorRate,
						  !((!_properties.resentLast) || _properties.lastPacketId));
			
			_properties.resentLast = false;
			_properties.lastPacketId = packet.get('id');
			_properties.sendingUntil = CLOCK + _delay();
			_properties.numPackets--;
			
			_output('Sending packet #' + packet.get('id') + ' to host ' + (_properties.receiver+1) , 'info');
			link.push(packet, _properties.sendingUntil);
			
			// Prepare next sensing
			_sense(_properties.sendingUntil + SENSE_DURATION);
		} else {
			_output('Defering sending, link in use', 'notice');
			_sense();
		}
	};
	
	/**
	 * Receive a packet from a sender
	 * 
	 * @param packet Received packet
	 */
	var _receive = function(packet) {
		var haveError = (packet.crc() == packet.get('checkseq')) ? 'success' : 'error';
		
		_output('Received packet #' + packet.get('id') + ' from host ' + packet.get('source').get('id'), haveError);
	};
	
	var _jam = function () {
		_properties.jamSignal++;
		
		if (_properties.backoffCoeff > 10) {
			_properties.backoffCoeff = 10;
		}
		
		if ((_properties.sendingUntil > 0) && (_properties.sendingUntil >= CLOCK)) {

			if (_properties.connected) {
				if (_properties.jamSignal < 15) {
					_properties.numPackets++;
					_properties.resentLast = true;
				} else {
					_output('Aborting sending packet #' + _properties.lastPacketId);
				}
				
				_output('Resending collided-packet #' + _properties.lastPacketId, 'error');
				
			} else {
				_output('Packet #' + _properties.lastPacketId + ' has collided, backoff now at ' + _properties.backoffCoeff, 'error');
			}
		} else {
			_output('Collision detected', 'notice');
		}

		_properties.sendingUntil = 0;
		_properties.linkIdle = true;
		
		_properties.backoffCoeff++;
		
		var sensingTime = CLOCK + SENSE_DURATION + ((Math.random() * Math.pow(2, _properties.backoffCoeff)) * 0.000512);
		
		_sense(sensingTime);
	};
	
	/**
	 * Delay to send a packet between hosts
	 * 
	 * @returns {Integer}  Transmit delay
	 */
	var _delay = function (){
		var propagationTime = _properties.distance / _c;
		var transmitTime = _properties.packetPayload.length / _properties.bandwith;
		return propagationTime + transmitTime;
	};
	
	var _nextVideoPacketInterval = function (packetId) {
		return Math.ceil(1572864 / _properties.packetPayload);
	};
	
	var _nextAudioPacketInterval = function (packetId) {
		return Math.ceil(65536 / _properties.packetPayload);
	};
	
	var _setAction = function (actionType, hostId, avgDataSize) {
		var sizeVariance = 0.5 * avgDataSize;
		_properties.dataSize = avgDataSize + Math.ceil((Math.random() *  sizeVariance) - (sizeVariance/2));
		_properties.numPackets = Math.ceil(_properties.dataSize / _properties.packetPayload);
		_properties.receiver = hostId;
		_properties.distance = Math.abs(_properties.id - hostId) * _properties.hostDistance;
		
		_output('Will send  '+ _bytesToSize(_properties.dataSize) + ' ('+ _properties.numPackets +' packets) of ' + actionType + ' to host ' + (hostId+1));
		
		_sense();
	};
	
	var _bytesToSize = function (bytes) {
	    var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	    if (bytes == 0) return 'n/a';
	    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
	};
	
	var _set = function (propertyName, value) {
		_properties[propertyName] = value;
	}; 
	
	var _get = function (propertyName) {
		return _properties[propertyName];
	};
	
	var _roundDecimal = function (num, precision) {
		var result = Math.round(num*Math.pow(10, precision))/Math.pow(10, precision);
		return result;
	};
	
	var _output = function (message, status) {
		var stat = status ? ' class="'+status+'"' : '';
		_outbox.append('<li'+stat+'>'+_roundDecimal(CLOCK, 10)+': '+message+'</li>');
	};
	
	var _init = function (settings) {
		for (attr in settings) {
			_properties[attr] = settings[attr];
		}		
	};
	
	return {
		sense: _sense,
		send: _send,
		jam: _jam,
		receive: _receive,
		get: _get,
		set: _set,
		setAction: _setAction,
		init: _init,
	};
}
