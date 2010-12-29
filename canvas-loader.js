/**
 * Canvas Loader Plugin 1.0
 *
 * Creates an alternative to ajax loader images with the canvas element.
 *
 * By Jamund Xcot Ferguson
 * 
 * Twitter: @xjamundx
 * Blog: http://www.jamund.com/
 *
 * Usage:
 *
 * Without options:
 *
 *      canvasLoader(el);
 *
 * With options:
 * 
 *		canvasLoaderReplace(el, {
 *   		'radius':10,
 *   		'color':'rgb(255,0,0),
 *  		'dotRadius':10,
 *			'backgroundColor':'transparent'
 *   		'className':'canvasLoader',   
 *   		'id':'canvasLoader1',
 *   		'fps':10
 *		});
 *	
 * Options:
 *
 *		radius - width/height of the loader
 * 		color - color of the pulsing dots
 * 		dotRadius - radius of the pulsing dots
 * 		className - class name of the canvas tag
 *		backgroundColor - a background color for the canvas
 * 		id - id of the canvas tag
 *		fps - approximate frames per second of the pulsing
 *
 **/

var canvasLoaderReplace = function(el, options) {

		// holds my canvas loader object
		var loaders = [];
	
		// holds my defaults object
		var defaults = {
			'radius':20,
			'color':'rgb(0,0,0)',
			'dotRadius':2.5,
			'backgroundColor':'transparent',
			'className':'canvasLoader',
			'id':'canvasLoader1',
			'fps':10
		};

		if (typeof(options) == 'object') {
			defaults.radius = options.radius ? options.radius : defaults.radius;
			defaults.color = options.color ? options.color : defaults.color;
			defaults.dotRadius = options.dotRadius ? options.dotRadius : defaults.dotRadius;
			defaults.backgroundColor = options.backgroundColor ? options.backgroundColor : defaults.backgroundColor;
			defaults.id = options.id ? options.id : defaults.id;
			defaults.fps = options.fps ? options.fps : defaults.fps;
		}
		
		// holds the generic settings objects
		var opts = defaults;
		
		// start drawing right away
		setInterval(draw, 1000/opts.fps);

		// the main drawing function			
		function draw() {
			for (i in loaders) {
				loaders[i].draw();
			}
		}
			
		var CanvasLoader = function(ctx, radius, color, dotRadius) {
			this.ctx = ctx;
			this.radius = radius;
			this.x = this.radius/2;
			this.y = this.radius/2;
			this.color = color;
			this.dotRadius = dotRadius;
			this.opacity = 1;
			this.numDots = 8;
			this.dots = {};
			this.degrees = Math.PI*2/this.numDots;
			for (i=1;i<=this.numDots;i++) {
				this.dots[i] = new Dot(Math.cos(this.degrees * i) * this.radius/Math.PI, Math.sin(this.degrees * i) * this.radius/Math.PI, this.dotRadius, this.color, i/this.numDots);
				this.dots[i].parent = this;
			}
		}
	
		CanvasLoader.prototype.draw = function() {
			// clear old stuff
			this.ctx.clearRect(0,0,this.radius,this.radius);
			
			// draw the background color
			this.ctx.globalAlpha = 1;
			this.ctx.fillStyle = opts.backgroundColor;
			this.ctx.fillRect(0,0,this.radius,this.radius);
			
			// fill in the dots
			for (i in this.dots) {
				this.dots[i].changeOpacity();
				this.dots[i].draw();
			}
		}		
		
		var Dot = function(x, y, radius, color, opacity) {
			this.radius = radius;
			this.color = color;
			this.opacity = opacity;
			this.x = x;
			this.y = y;
		}
		
		Dot.prototype.draw = function() {
			this.parent.ctx.beginPath();
			this.parent.ctx.globalAlpha = this.opacity;
		    this.parent.ctx.fillStyle = this.color;
			this.parent.ctx.arc(this.x+(this.parent.radius/2), this.y+(this.parent.radius/2), this.radius, 0, Math.PI*2, true);
			this.parent.ctx.fill();
		}
		
		Dot.prototype.changeOpacity = function() {
			this.opacity -= 1/this.parent.numDots;
			if (this.opacity < 0) this.opacity = 1;
		}
		
		// where the magic happens
		
		// create a canvas object and get the context
		var canvas = document.createElement("canvas");
		canvas.setAttribute('width', opts.radius);
		canvas.setAttribute('height', opts.radius);
		canvas.setAttribute('id', opts.id);					
		canvas.setAttribute('className', opts.className);
		var ctx = canvas.getContext("2d");
					
		// simple feature detection, needs work
		if (!!ctx) {
			loaders[loaders.length+1] = new CanvasLoader(ctx, opts.radius, opts.color, opts.dotRadius);
			el.parentNode.replaceChild(canvas, el);
		}
	}