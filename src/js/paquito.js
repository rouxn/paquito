var CLOCK = 0;

var Paquito = function () {
	var link = Link();
	var started = false;
	var baseHost = $('#host-1');
	var hosts = [];
	
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
		
		$('#avgDataSize').spinbox({
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
			
			var avgDataSize = $('#avgDataSize').val() * $('#avgDataSizeUnit').val();
			hosts[hostId].setAction(randomAction, randomHost, avgDataSize);
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
	
	var _manageEvents = function () {
		while (link.inUse()) {
			var event = link.pop();
			
			CLOCK = event.clock;
			
			if (event.type == 'packet') {
				link.setIdle();
				event.object.get('destination').receive(event.object);
			} else if (event.type == 'trafic') {
				event.object.set('linkIdle', false);
			} else if (event.type == 'sense') {
				event.object.send();
			}
		}
	};
	
	return {
		init: _init,
	};
	
}();
