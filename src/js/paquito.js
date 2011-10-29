/**
 * Paquito network simulation
 * 
 * @version 0.1
 */
var PKT = function () {
	var _sender = host();
	var _receiver = host();
	var _stats = STS;
	
	var _settings = {
		debug: true, // output debug info
		debugMode: 'console', // debug output method ('console', 'html' or 'alert')
	};
	
	
	/**
	 * @returns {Integer} Timestamp
	 */
	var _timestamp = function () {
		return new Date().getTime();
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
	
	var _senderOut = function (msg) {
		$('#sender').append('<li>' + msg + '</li>');
	};
	
	var _receiverOut = function (msg, status) {
		var stat = status ? ' class="'+status+'"' : ''
		$('#receiver').append('<li'+stat+'>' + msg + '</li>');
	};

	var _test = function(){
		  // Some simple loops to build up data arrays.
		  var cosPoints = [];
		  for (var i=0; i<2*Math.PI; i+=0.4){ 
		    cosPoints.push([i, Math.cos(i)]); 
		  }
		    
		  var sinPoints = []; 
		  for (var i=0; i<2*Math.PI; i+=0.4){ 
		     sinPoints.push([i, 2*Math.sin(i-.8)]); 
		  }
		    
		  var powPoints1 = []; 
		  for (var i=0; i<2*Math.PI; i+=0.4) { 
		      powPoints1.push([i, 2.5 + Math.pow(i/4, 2)]); 
		  }
		    
		  var powPoints2 = []; 
		  for (var i=0; i<2*Math.PI; i+=0.4) { 
		      powPoints2.push([i, -2.5 - Math.pow(i/4, 2)]); 
		  } 
		 
		  var plot = $.jqplot('chart', [cosPoints, sinPoints, powPoints1, powPoints2], 
		    { 
		      title:'Line Style Options', 
		      // Series options are specified as an array of objects, one object
		      // for each series.
		      series:[ 
		          {
		            // Change our line width and use a diamond shaped marker.
		            lineWidth:2, 
		            markerOptions: { style:'dimaond' }
		          }, 
		          {
		            // Don't show a line, just show markers.
		            // Make the markers 7 pixels with an 'x' style
		            showLine:false, 
		            markerOptions: { size: 7, style:"x" }
		          },
		          { 
		            // Use (open) circlular markers.
		            markerOptions: { style:"circle" }
		          }, 
		          {
		            // Use a thicker, 5 pixel line and 10 pixel
		            // filled square markers.
		            lineWidth:5, 
		            markerOptions: { style:"filledSquare", size:10 }
		          }
		      ]
		    }
		  );
		};
	
	var _setSpinboxes = function () {
		$('#bandwidth').spinbox({
			min: 1,
			max: 1023,
			step: 10,
		});
		
		$('#distance').spinbox({
			min: 1,
			max: 2500,
			step: 100,
		});
		
		$('#framePayload').spinbox({
			min: 100,
			max: 1500,
			step: 100,
		});
		
		$('#numFrame').spinbox({
			min: 1,
			max: 1000,
			step: 2,
		});
		
		$('#frameInterval').spinbox({
			min: 1,
			max: 1000,
			step: 20,
		});
		
		$('#frameLoss').spinbox({
			min: 1,
			max: 100,
			step: 5,
		});
		
		$('#errorRate').spinbox({
			min: 1,
			max: 100,
			step: 5,
		});
	};
	
	var _setSimulationProperties = function () {
		_sender.errorRate($('#errorRate'). val() / 100);
		_sender.frameLength($('#framePayload').val());
		_sender.frameInterval($('#frameInterval').val());
		_sender.frameLoss($('#frameLoss').val() / 100);
		
		_receiver.distance($('#distance').val());
		_receiver.bandwidth($('#bandwidth').val() * $('#bandwidthUnit').val());
		
		_sender.send(null, $('#numFrame').val());
	};
	
	var _resetSimulation = function () {
		frameId = 0;
		$('#sender').html('');
		$('#receiver').html('');
		_stats.reset();
	};
	
	/**
	 * Initialize Paquito
	 * @param {Object} settings
	 */
	var _init = function(settings) {
		for(attr in settings) {
			_settings[attr] = settings[attr];
		}
		
		_setSpinboxes();
		
		_sender.output(_senderOut);
		_sender.isSender(true);
		_sender.receiver(_receiver);
		
		_receiver.output(_receiverOut);
		_receiver.receiver(_sender);

		$('#launch').click(function () {
			_setSimulationProperties();
			return false;
		});
		
		$('#clear').click(function () {
			_resetSimulation();
			return false;
		});

//		_test();
	};
	
	// expose public properties and methods
	return {
		init: _init,
	};
}();
