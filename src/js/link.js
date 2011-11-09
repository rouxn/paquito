(function() {

  /*global Link */
  /**
   * @constructor
   * @class Link manages a queue of elements with priorities.
   */
  Link = function() {
    var contents = [];
    var hosts = []; // Hosts connected to the link
    var sorted = false;
    var sortStyle = function(a, b) {
        return b.clock - a.clock;
    };

    /**
     * @private
     */
    var sort = function() {
      contents.sort(sortStyle);
      sorted = true;
    };
    
    /**
     * @private
     * 
     * Set the link as in use when going through the host
     */
    var setLinkNotification = function (packet, finalClock) {
    	var minHostId = Math.min(packet.get('source').get('id'), packet.get('destination').get('id'));
    	var maxHostId = Math.max(packet.get('source').get('id'), packet.get('destination').get('id'));
    	var noticeInterval = finalClock / (maxHostId - minHostId);
    	
    	for (var hostId=minHostId; hostId < maxHostId; hostId++) {
    		contents.push({object: hosts[hostId], 
    					   clock: ((hostId-minHostId)*noticeInterval), 
    					   type: 'trafic'});
    	}
    };
    
    /**
     * @private
     */
    var checkForCollision = function () {
    	var length = contents.length;
    	for (var event=0; event < length; event++) {
    		if (contents[event].type == 'packet') {
    			sendJamSignal();
    			return;
    		}
    	}
    };
    
    /**
     * @private
     */
    var sendJamSignal = function () {
    	contents = [];

    	for (var hostId=0; hostId < hosts.length; hostId++) {
    		hosts[hostId].jam();
    	} 
    };
    
    var self = {
      /**
       * Removes and returns the next element in the queue.
       * @member Link
       * @return The next element in the queue. If the queue is empty returns
       * undefined.
       *
       * @see PrioirtyQueue#top
       */
      pop: function() {
        if(!sorted) {
          sort();
        }

        var element = contents.pop();

        if(element) {
          return element;
        } else {
          return undefined;
        }
      },

      /**
       * Returns but does not remove the next element in the queue.
       * @member Link
       * @return The next element in the queue. If the queue is empty returns
       * undefined.
       *
       * @see Link#pop
       */
      top: function() {
        if(!sorted) {
          sort();
        }

        var element = contents[contents.length - 1];

        if(element) {
          return element.object;
        } else {
          return undefined;
        }
      },
      
      /**
       * Returns the next clock in the queue
       * @member Link
       * @return The next element clock in the queue. If the queue is empty returns
       * undefined.
       */
      nextClock: function () {
		    if(!sorted) {
	          sort();
	        }
	
	        var element = contents[contents.length - 1];
	
	        if(element) {
	          return element.clock;
	        } else {
	          return undefined;
	        }
	  },

      /**
       * @member Link
       * @param object The object to check the queue for.
       * @returns true if the object is in the queue, false otherwise.
       */
      includes: function(object) {
        for(var i = contents.length - 1; i >= 0; i--) {
          if(contents[i].object === object) {
            return true;
          }
        }

        return false;
      },

      /**
       * @member Link
       * @returns the current number of elements in the queue.
       */
      size: function() {
        return contents.length;
      },

      /**
       * @member Link
       * @returns true if the queue is not empty, false otherwise.
       */
      inUse: function() {
        return contents.length !== 0;
      },

      /**
       * @member Link
       * @param object The object to be pushed onto the queue.
       * @param clock The clock of the object.
       */
      push: function(object, when, type) {
    	  type = type || 'packet';
    	  
    	  if (type == 'packet') {
			  setLinkNotification(object, when);
			  checkForCollision();
		  }

		  contents.push({object: object, clock: when, type: type});
		  sorted = false;
      },
      
      /**
       * @member Link
       * @param object Host list connected to link
       */
      connectHosts: function(newHosts) {
    	 hosts = newHosts;
      },
      
      /**
       * @member Link
       */
      setIdle: function () {
    	for (var hostId=0; hostId < hosts.length; hostId++) {
    		hosts[hostId].set('linkIdle', true);
    	}  
      },
    };

    return self;
  };
})();