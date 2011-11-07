
var Paquito = function () {
	var link = Link();
	var started = false;
	var baseHost = $('#host-1');
	var currentTime = 0;
	var hosts = [];
	var MAX_UNUSED_BEAT = 50; // Number of heartbeat unused before stoping
	var unusedBeats = 0;
	
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
	
	var _manageTabs = function () {
		var tabContainers = $('div.tabs > div');
		
		$('div.tabs ul.tabNavigation a').click(function () {
			tabContainers.hide();
			tabContainers.filter(this.hash).show();
			$('div.tabs ul.tabNavigation a').removeClass('selected');
			$(this).addClass('selected');
			return false;
		}).filter(':first').click();
	};
	
	var _filterOutput = function () {
		$('#parameters input[type=checkbox]').click(function () {
				$('.outbox li.'+$(this).val()).toggle();
		});
	};
	
	var _setupSimulation = function () {
		for (var hostId=1; hostId <= $('#numHost').val(); hostId++) {
			_createHostOutputBox(hostId);
			var host = Host(hostId, link);

			hosts.push(host);
			host.init({
				link: link,
				packetPayload: $('#packetPayload').val(),
				hostDistance: $('#hostDistance').val(),
				errorRate: $('#errorRate').val() / 100,
				bandwith: $('#bandwidth').val() * $('#bandwidthUnit').val(),
			});
			
		}
		
		_setHostsActions();
		link.connectHosts(hosts);
	};
	
	var _setHostsActions = function () {
		var actions = ['video', 'audio', 'data'];
		
		for (var hostId=0; hostId < hosts.length; hostId++) {
			var randomAction = actions[Math.floor(Math.random() * actions.length)];
			
			var randomHost = hostId;
			while (randomHost == hostId) {
				randomHost = Math.floor(Math.random() * hosts.length);
			}
			
			hosts[hostId].set('hosts', hosts);
			hosts[hostId].setAction(randomAction, randomHost);
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
			
			_manageTabs();
			_filterOutput();
	};
	
	var _shuffleHosts = function () {
		var newHosts = [];
		for (var i=0; i < hosts.length; i++) {
			newHosts[i] = hosts[i];
		}
		
		newHosts.sort(function() { 
			return Math.random() - 0.5;
		});
		
		return newHosts;
	};
	
	var _beat = function () {
		// Shuffle hosts to avoid first hosts to be the firsts sending
		var shuffledHosts = _shuffleHosts(); 
		
		for (var i=0; i < shuffledHosts.length; i++) {
			shuffledHosts[i].heartbeat(currentTime);
		}
	};
	
	var _manageEvents = function () {
		while (unusedBeats <= MAX_UNUSED_BEAT) {
			currentTime += 0.0001;
			_beat();
			
			if (link.topPriority() <= currentTime) {
				var currentPacket = link.pop();
				currentPacket.get('destination').receive(currentPacket);
				unusedBeats = 0;
			} else {
				unusedBeats++;
			}
			
		}
	};
	
	return {
		init: _init,
	};
	
}();
