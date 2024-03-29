/**
 * Load JavaScript libraries
 */

var JS_DIR = 'js/';
var JS_LIBS_DIR = JS_DIR + 'libs/';

Modernizr.load([{
//  load: 'http:/­/ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js',
//  callback: function () {
//    if (!window.jQuery) {
//      ({
        load: JS_LIBS_DIR + 'jquery-1.6.4.min.js',
        callback: function (url, result, key) {
//          console.log('Local jquery lib loaded');
        }
//      });
//    }
//  }
}, {
  load: [JS_LIBS_DIR + 'jquery.spinbox.min.js',
         JS_LIBS_DIR + 'jquery.flot.js',
         JS_DIR + 'stats.js',
         JS_DIR + 'packet.js',
         JS_DIR + 'host.js', 
         JS_DIR + 'link.js',
         JS_DIR + 'paquito.js' ],
  callback: function (url, result, key) {
//    console.log(url + ' loaded');
  },
  complete: function () {
    Paquito.init();
  }
}]);

