var currentTime = 0;
var hosts = [];

var Paquito = function () {
	var packets = PriorityQueue({low: true});
	var started = false;
	var baseHost = $('#host-1');
	
	var _setSpinboxes = function () {
		$('#numHost').spinbox({
			min: 2,
			max: 1024,
			step: 2,
		});
		
		$('#bandwidth').spinbox({
			min: 1,
			max: 9999,
			step: 10,
		});
		
		$('#hostDistance').spinbox({
			min: 1,
			max: 2500,
			step: 100,
		});
		
		$('#packetPayload').spinbox({
			min: 100,
			max: 1500,
			step: 100,
		});
		
		$('#errorRate').spinbox({
			min: 1,
			max: 100,
			step: 5,
		});
	};
	
	var _createHostOutputBox = function (hostId) {
		var newHost = $('#host-'+hostId);
		
		if (newHost.length == 0) {
			newHost = baseHost.clone();
			newHost.attr('id', 'host-'+hostId);
			newHost.find('.host-no').text(hostId);
			
			$('article').append(newHost);
		}
		
	};
	
	var _deleteHostOutputBox = function (hostId) {
		var host = $('#host-'+hostId);
		
		host.fadeOut('slow').remove();
	};
	
	var _setupSimulation = function () {
		for (var hostId=1; hostId <= $('#numHost').val(); hostId++) {
			_createHostOutputBox(hostId);
			var host = Host(hostId, packets);

			hosts.push(host);
			host.init({
				adaptor: packets,
				packetPayload: $('#packetPayload').val(),
				hostDistance: $('#hostDistance').val(),
				errorRate: $('#errorRate').val() / 100,
				bandwith: $('#bandwidth').val() * $('#bandwidthUnit').val(),
			});
			
		}
		
		_setHostsActions();
	};
	
	var _setHostsActions = function () {
		var actions = ['video', 'audio', 'data'];
		
		for (var hostId=0; hostId < hosts.length; hostId++) {
			var randomAction = actions[Math.floor(Math.random() * actions.length)];
			
			var randomHost = hostId;
			while (randomHost == hostId) {
				randomHost = Math.floor(Math.random() * hosts.length);
			}
			
			hosts[hostId].setAction(randomAction, randomHost);
		}
	};
	
	var _resetSimulation = function () {
		for (var i=1; i < hosts.length; i++) {
			_deleteHostOutputBox(i+1);
		}
	};
	
	var _init = function() {
			_setSpinboxes();
	
			$('#startSimulation').click(function () {
				if (!started) {
					$('#startSimulation').addClass('disabled');
					_setupSimulation();
					started = true;
					_manageEvents();
				}
				
				return false;
			});
	};
	
	var _manageEvents = function () {
		while (!packets.empty()) {
			var currentPacket = packets.pop();
			
			currentPacket.get('destination').receive(currentPacket);
		}
	};
	
	return {
		init: _init,
	};
	
}();
