/**
*	Namespace and globals
*/

var o = {
	socket: io.connect('http://liveboard.herokuapp.com/')
,	events: _.extend({}, Backbone.Events)
,	pointers: {}
,	board: {}
,	'last-z-index': 0
};

/**
 *	Cookies
 */
//	$.cookie('pointer',null);
	
	if ( $.cookie('pointer') ) {
		o._id = $.cookie('pointer');
	} else {
		o._id = 'pointer' + Math.floor(Math.random()*16777215).toString(16);
		$.cookie('pointer', o._id);
	}

/**
 *	Utils
 */

o.id = function() { 
	return Math.floor(Math.random()*16777215).toString(16); 
}

o.getLastZIndex = function() { 
	return o['last-z-index']++
}

o.getMousePosition = function(e) {

	// From http://www.quirksmode.org/js/events_properties.html

	var posx = 0;
	var posy = 0;

	if (!e) var e = window.event;

	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}

	return { 
		posx: posx,
		posy: posy
	}
}

/**
*	Require config
*/

require.config({

});

/**
*	Initialization
*/

require([
	
	'routers/LiveBoardRouter'

],

function(Router){

	// Router initialization
	o.router = new Router();
	// Navigate to Now And Next by default
	if ( !(/#/).test(window.location.toString()) ) {
		o.router.navigate('board');
	}

	// Initializate history managment
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
	Backbone.history.start();

});