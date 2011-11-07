function Host(hostId, link) {
	var _c = 2.3 * Math.pow (10,8); // Light speed in copper 
	var _outbox = $('#host-'+hostId+' ul');
	var bitRates = { // TODO: Use bit rate
			video: _nextVideoPacketInterval,
			audio: _nextAudioPacketInterval,
	};
	var currentTime = 0;

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
		sendNextBeat: false,
	};
	
	/**
	 * Send a packet to a the defined receiver
	 * 
	 * @param {Integer} packetLength
	 * @param {Integer} numPacket
	 */
	var _send = function () {
		var packet = Packet();
		packet.create(_properties.hosts[_properties.id-1],
					  _properties.hosts[_properties.receiver], 
					  _properties.packetPayload, 
					  _properties.errorRate);
		link.push(packet, currentTime+_delay());
		_properties.numPackets--;
		_output('Sending packet #' + packet.get('id') + ' to host ' + (_properties.receiver+1) , 'info');
	};
	
	/**
	 * Receive a packet from a sender
	 * 
	 * @param packet Received packet
	 */
	var _receive = function(packet) {
		if (!_properties.linkIdle) {
			_output('Collision detected!', 'error');
		}
		
		var haveError = (packet.crc() == packet.get('checkseq')) ? 'success' : 'error';
		
		_output('Received packet #' + packet.get('id') + ' from host ' + packet.get('source').get('id'), haveError);
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
	
	var _setAction = function (actionType, hostId) {
		_properties.dataSize = Math.ceil(Math.random() *  5000);
		_properties.numPackets = Math.ceil(_properties.dataSize / _properties.packetPayload);
		_properties.receiver = hostId;
		_properties.distance = Math.abs(_properties.id - hostId) * _properties.hostDistance;
		
		_output('Will send  '+ _bytesToSize(_properties.dataSize) + ' ('+ _properties.numPackets +' packets) of ' + actionType + ' to host ' + (hostId+1));
	};

	var _heartbeat = function (time) {
		currentTime = time;
		
		// If we have nothing to send
		if (_properties.numPackets <= 0) {
			return;
		}

		if (_properties.sendNextBeat) {
			if (_properties.linkIdle) {
				_send();
				_properties.sendNextBeat = false;
			} else {
				_output('Defering sending, link used', 'notice');
			}
		} else {
			_properties.sendNextBeat = true;
		}
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
		_outbox.append('<li'+stat+'>'+_roundDecimal(currentTime, 5)+': '+message+'</li>');
	};
	
	var _init = function (settings) {
		for (attr in settings) {
			_properties[attr] = settings[attr];
		}		
	};
	
	return {
		send: _send,
		receive: _receive,
		get: _get,
		set: _set,
		setAction: _setAction,
		init: _init,
		heartbeat: _heartbeat,
	};
}
