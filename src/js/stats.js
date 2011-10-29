/**
 * Provides statistics on network 
 */
var STS = (function () {
	var sended = 0;
	var received = 0;
	var error = 0;

	var _frameReceived = function (haveError) {
		received++;
		
		if (haveError) {
			error++;
		}

		_setStats();
	};
	
	var _frameSended = function () {
		sended++;
		
		_setStats();
	};
	
	var _roundDecimal = function (num) {
		var result = Math.round(num*Math.pow(10, 2))/Math.pow(10, 2);
		return result;
	};
	
	var _setStats = function () {
		$('#frameTransmited').html(sended);
		$('#frameReceived').html(received);
		$('#lossRate').html(_roundDecimal((((sended-received)/sended)*100) || 0));
		$('#numFrameError').html(error);
		$('#frameErrorRate').html(_roundDecimal((((1-(received-error)/received))*100) || 0));
	};
	
	var _reset = function () {
		sended = 0;
		received = 0;
		error = 0;
		
		_setStats();
	};
	
	return {
		frameReceived: _frameReceived,
		frameSended: _frameSended,
		reset: _reset,
	};
})();
