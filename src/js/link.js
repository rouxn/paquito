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
        return b.priority - a.priority;
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
     */
    var setLinkIdle = function (idle) {
    	for (var hostId=0; hostId < hosts.length; hostId++) {
        	hosts[hostId].set('linkIdle', idle);
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
          setLinkIdle(true);
          return element.object;
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
       * Returns priority of the next element in the queue.
       * @member Link
       * @return The next element priority in the queue. If the queue is empty returns
       * undefined.
       */
      topPriority: function () {
		    if(!sorted) {
	          sort();
	        }
	
	        var element = contents[contents.length - 1];
	
	        if(element) {
	          return element.priority;
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
       * @returns true if the queue is empty, false otherwise.
       */
      empty: function() {
        return contents.length === 0;
      },

      /**
       * @member Link
       * @param object The object to be pushed onto the queue.
       * @param priority The priority of the object.
       */
      push: function(object, priority) {
        contents.push({object: object, priority: priority});
        sorted = false;
        setLinkIdle(false);
      },
      
      /**
       * @member Link
       * @param object Host list connected to link
       */
      connectHosts: function(newHosts) {
    	 hosts = newHosts;
      }
    };

    return self;
  };
})();