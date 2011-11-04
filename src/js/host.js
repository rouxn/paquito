function Host(hostId, adaptor) {
	var _c = 2.3 * Math.pow (10,8); // Light speed in copper 
	var _outbox = $('#host-'+hostId+' ul');
	var bitRates = {
			video: _nextVideoPacketInterval,
			audio: _nextAudioPacketInterval,
	}

	var _properties = {
		id: hostId,
		adaptor: adaptor,
		packetPayload: 0,
		hostDistance: 0, // Consecutive host distance
		packetInterval: 0,
		errorRate: 0, // Percents of error when sending a packet
		bandwith: 0, // Bandwidth between links in bits/s
		dataSize: 0, // Size of the data to send
		numPackets: 0, // Number of packets sent
		receiver: 0,
		distance: 0, // Distance to the current receiver
	};
	
	/**
	 * Send a packet to a the defined receiver
	 * 
	 * @param {Integer} packetLength
	 * @param {Integer} numPacket
	 */
	var _send = function () {
		var lastSent = 0;
		for (; _properties.numPackets > 0; _properties.numPackets--) {
			var packet = Packet();
		
			packet.create(this, hosts[_properties.receiver], _properties.packetPayload, _properties.errorRate);
			lastSent += _delay();
			adaptor.push(packet, lastSent);
		}
	};
	
	/**
	 * Receive a packet from a sender
	 * 
	 * @param packet Received packet
	 */
	var _receive = function(packet) {
		var haveError = (packet.crc() == packet.get('checkseq')) ? null : 'error';
		
		_output('Received packet #' + packet.get('id'), haveError);
	};
	
	/**
	 * Delay to send a packet between hosts
	 * 
	 * @returns {Integer}  Transmit delay
	 */
	var _delay = function (){
		var propagationTime = _properties.distance / _c;
		var transmitTime = _properties.packetLength / _properties.bandwith;
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
		
		_output('Sending ' + actionType + ' of ' + _bytesToSize(_properties.dataSize) + '('+ _properties.numPackets +' packets) to host ' + (hostId+1));
		
		// Start sending packets
		_send();
	};

	var _bytesToSize = function (bytes) {
	    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
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
	
	var _output = function (message, status) {
		var stat = status ? ' class="'+status+'"' : '';
		_outbox.append('<li'+stat+'>'+message+'</li>');
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
	};
}
