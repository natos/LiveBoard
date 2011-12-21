/**
*	LiveBoardView.js
*/

define([

	'templates/LiveBoardTemplate'
,	'views/CardView'
,	'collections/CardCollection'

],

function(template, CardView, CardCollection) {

	return Backbone.View.extend({

		el: $('#live-board')

,		template: _.template( template )

,		events: {
			'dblclick'		: 'new-card-handler'
		,	'mousemove'		: 'moving-cursor-handler'
		,	'mousedown'		: 'clicking-handler'
		,	'mouseup'		: 'clicking-handler'

		}

,		initialize: function() {

			this.cards = new CardCollection();

			this.render();

			this.trigger('view-initialized', this);

			this.connect();

		}

,		render: function() {

			this.el.html( this.template );

		}

,		connect: function() {

	    	o.socket.emit('connected', o._id);

			o.socket.on('create pointer', this.createPointerControl);

			o.socket.on('user moving', this.userMovingControl);

			o.socket.on('clicked', this.clickedControl);


			// host
			o.socket.on('new-card-created', this['new-card-host-handler']);

			o.socket.on('remove-card', this['remove-card-handler'])

			o.socket.on('card-start-drag', this['card-start-drag-handler']);

			o.socket.on('card-draggin', this['card-draggin-handler']);

			o.socket.on('card-stop-drag', this['card-stop-drag-handler']);

		}

/**
*	UI Event Handlers
*/

,		'new-card-handler': function(event) {

			var offset = this.el.offset();

			var _click = {
				top: event.pageY - offset.top
			,	left: event.pageX - offset.left
			}

			var card = new CardView( _click );

			this.cards.add( card );

			o.socket.emit('new-card-created', _click, card.id);

		}

,		'new-card-host-handler': function(_click, _id) {
			// socket scope
			if (!_click) {
				return;
			}

			var card = new CardView( _click, _id );

			o.board.cards.add( card );

		}

,		'remove-card-handler': function(_id) {
			// socket scope

			var card, cardModel = o.board.cards.find(function(i){ 
				return i.id === _id;
			});

			if (cardModel) {
				card = cardModel.get('card').remove();
			}

		}

,		'card-start-drag-handler': function(_id) {
			// socket scope

			var card, cardModel = o.board.cards.find(function(i){ 
				return i.id === _id;
			});

			if (cardModel) {
				card = cardModel.get('card');
				if (!card.editMode && !card.dragStatus) {
					card.startDrag();
				}
			}

		}

,		'card-draggin-handler': function(_id, points) {
			// socket scope

			var card, cardModel = o.board.cards.find(function(i){ 
				return i.id === _id;
			});

			if (cardModel) {
				card = cardModel.get('card')
				card
					.addClass('dragging')
					.css({
						top: points.top + 'px'
					,	left: points.left + 'px'
					})
					.removeClass('dragging');

			}

		}

,		'card-stop-drag-handler': function(_id) {
			// socket scope

			var card, cardModel = o.board.cards.find(function(i){ 
				return i.id === _id;
			});

			if (cardModel) {
				card = cardModel.get('card').stopDrag();
			}

		}

,		'moving-cursor-handler': function(event) {
			o.socket.emit("moving", o._id, o.getMousePosition(event) );
		}

,		'clicking-handler': function(e) {
			var itemId = $(e.target).parents('li').attr('id');
			o.socket.emit("clicking", o._id, o.getMousePosition(e), e.type, itemId );
		}

/**
*	Socket Event Handlers
*/

//	Scoped inside Sockets namespace use o.board to access the LiveBoard scope

,		createPointerControl: function(e) {

			var id = e._id;

			if ( o.pointers[id] ) {
				return;
			}

			o.pointers[id] = $('<div id="' + id + '">')
			.css({
				'background-color': '#' + id.split('pointer').join(''),
				'width': '5px',
				'height': '5px',
				'position': 'absolute'
			})
			.addClass('pointer')
			.appendTo('body');
		}

,		userMovingControl: function(e) {

			var id = e._id, w, h,
				posx = e.data.posx,
				posy = e.data.posy;

			if ( !o.pointers[id] ) {
				o.board.createPointerControl(e);
				return;
			}

			w = o.pointers[id].css('width').split('px').join('');
			h = o.pointers[id].css('height').split('px').join('');

			o.pointers[id].css({
				'top': posy - h + 'px',
				'left': posx - w + 'px'
			});
		}

,		clickedControl: function(e) {

			var id = e._id, w, h,
				posx = e.data.posx,
				posy = e.data.posy
				type = e.event;
				itemId = e.itemId;

			if ( !o.pointers[id] ) {		
				return;
			}

			if (itemId) {
				$('#' + itemId).blink();
			}

			w = o.pointers[id].css('width').split('px').join('');
			h = o.pointers[id].css('height').split('px').join('');

			if (type === 'mousedown') {
				o.pointers[id].addClass('clicked').css({
					'width': '10px',
					'height': '10px',
					'top': posy - (h/2) + 'px',
					'left': posx - (w/2) + 'px'
				}).removeClass('clicked');
			} else {
				o.pointers[id].css({
					'width': '5px',
					'height': '5px',
					'top': posy + 'px',
					'left': posx + 'px'
				});
			}
		}

	});

}) // define