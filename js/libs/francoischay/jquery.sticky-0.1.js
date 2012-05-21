(function($) {
	var toTop     			= 0;
	var toTopNew  			= 0;
	var direction 			= 0;
  	var START_STICK 		= "stickstart";
  	var STICKING 			= "sticking";
  	var NOT_STICKING 		= "notsticking";
  	var BEFORE_END_STICK 	= "stickbeforestop";
  	var END_STICK 			= "stickstop";

	var methods = {

		init : function(_options){
			if(this.data("init") === true) return this;

	  		options = $.extend({}, $.fn.sticky.defaults, _options);
	  		if(options.debug) console.log(options)
	  		this
	  			.data({
	  				"init"       : true,
	  				"options" 	 : options,
	  				"sticky-top" : this.css("top")
	  			})
	  			.addClass("sticky")
	  		$(window).on("scroll.sticky", $.proxy(onScroll, this))

	  		return this;
		},

		destroy : function(){
			this
				.removeClass("sticky")
				.removeClass("fixed")
				.removeData()
				.css("top", this.data("sticky-top"))

	  		return this;
		}

	};

	function onScroll(_e){
		if(!this.data("init")) return;

		toTopNew  = $(window).scrollTop();
		if(toTopNew != toTop){
			direction = (toTopNew > toTop) ? "down": "up";
			toTop 	  = toTopNew;
		}

		for (var i = 0; i < this.length; i++) {
			var el 	    = $(this[i]);
			var options = el.data("options");
			var elStart = options.y - options.offsetY;
			var elEnd   = (options.duration > 0)? elStart + options.duration : $(document).height();

			if(options.debug == true) console.log("elStart: "+elStart, "> toTop: "+toTop, "> elEnd: "+elEnd);

			// start to stick
			if(toTop > elStart && toTop < elEnd){
				if(!el.hasClass("fixed")) onStart(el)
				action(el, (toTop - elStart) / (elEnd - elStart));
			}
			// end the stickyness
			else{
				if(el.hasClass("fixed")){
					onEnd(el);	
				} 
				onNotSticking(el, (toTop - elStart) / (elEnd - elStart));
			}
		}
	}

  	function onStart(_el){
		_el
			.addClass("fixed")
  			.trigger(START_STICK, [direction]);

		var options = _el.data("options");
  		if(options.start)	options.start(_el, direction);
  	}

  	function action(_el, _ratio){
  		_el.trigger(STICKING, [direction]);

		var options = _el.data("options");
		if(options.action)	options.action(_el, _ratio, direction);
  	}

  	function onNotSticking(_el, _ratio){
		_el.trigger(NOT_STICKING, [direction])

		var options = _el.data("options");
		if(options.notSticking)	options.notSticking(_el, _ratio, direction);
  	}

  	function onEnd(_el){

		var options = _el.data("options");
		if(options.beforeEnd) options.beforeEnd(_el, direction);

  		_el
  			.trigger(BEFORE_END_STICK, [direction])
			.removeClass("fixed")
  			.trigger(END_STICK, [direction]);
		
		if(options.end) options.end(_el, direction);
  	}

	$.fn.sticky = function(_method) {
	    if ( methods[_method] ) {
			return methods[ _method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } 
	    else if ( typeof _method === 'object' || ! _method ) {
			return methods.init.apply( this, arguments );
	    } 
	    else {
			$.error( 'Method ' +  _method + ' does not exist on jQuery.sticky' );
	    }    
  	};

	$.fn.sticky.defaults = {
		offsetY		: 0,
		duration 	: 0, 	// 0 = infini
		start  		: null, // called when start sticking
		action  	: null, // called when scrolling & sticking
		notSticking : null, // called when scrolling but not sticking
		beforeEnd   : null, // callback juste before removing .fixed
		end         : null, // callback
		debug       : false
	};

})(jQuery);