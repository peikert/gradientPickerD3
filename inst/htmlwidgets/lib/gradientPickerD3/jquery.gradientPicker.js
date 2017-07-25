/**
@author Matt Crinklaw-Vogt (tantaman)
@author Christian D. Peikert (peikert)
*/

/*
The original JS script was created by Matt Crinklaw-Vogt and was modified by Christian D. Peikert.

Major changes:
- function now get to lists, one for color and one for the ticks
- function returns ticks for colorboxes, there percentage of the total range as well as the color itself
- added Shiny return value. Pushed after change ticks by dragging (after drop), after removing a colorbox and after changing of the color.
- style is kicked of
- marks and labels for init color position were added
- open color menu of boxes is now opened by doubleclick
*/
(function( $ ) {
	if (!$.event.special.destroyed) {
		$.event.special.destroyed = {
		    remove: function(o) {
		    	if (o.handler) {
		    		o.handler();
		    	}
		    }
		}
	}

	function ctrlPtComparator(l,r) {
		return l.position - r.position;
	}

	function bind(fn, ctx) {
		if (typeof fn.bind === "function") {
			return fn.bind(ctx);
		} else {
			return function() {
				fn.apply(ctx, arguments);
			}
		}
	}

	var browserPrefix = "";
	var agent = window.navigator.userAgent;
	if (agent.indexOf('WebKit') >= 0)
		browserPrefix = "-webkit-"
	else if (agent.indexOf('Mozilla') >= 0)
		browserPrefix = "-moz-"
	else if (agent.indexOf('Microsoft') >= 0)
		browserPrefix = "-ms-"
	else
		browserPrefix = ""
	
	function GradientSelection($el, opts) {
		this.$el = $el;
		this.$el.css("position", "relative");
		this.opts = opts;
		/*
id='gradientPicker-ctrlPts_preview'
id='gradientPicker-ctrlPts_container'
id='gradientPicker-removescalebar_line'
id='gradientPicker-scalebar_label'
*/
		var $preview = $("<canvas id='gradientPicker-ctrlPts_preview'; class='gradientPicker-ctrlPts'></canvas>");
		this.$el.append($preview);
		var canvas = $preview[0];
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		this.g2d = canvas.getContext("2d");

		var $ctrlPtContainer = $("<div id='gradientPicker-ctrlPts_container'; class='gradientPicker-ctrlPts'></div>");
		this.$el.append($ctrlPtContainer)
		this.$ctrlPtContainer = $ctrlPtContainer;
		
		//<scalebar_line
		var $ctrlPtContainer_scalebar_line = $("<div id='gradientPicker-scalebar_line'; class='gradientPicker-ctrlPts_scalebar_line'></div>");
		this.$el.append($ctrlPtContainer_scalebar_line);
		var toAdd = document.createDocumentFragment();
		for (i = 0; i <this.opts.controlTicks.length; i++) { 
			var newDiv = document.createElement('div');
			newDiv.id = 'sline'+i;
			newDiv.style.left = ((this.g2d.canvas.width*this.opts.controlProcent[i])-1)+'px';
			newDiv.className = 'gradientPicker-ctrlPts_scalemarks_line';
			toAdd.appendChild(newDiv);
		}
		document.getElementById('gradientPicker-scalebar_line').appendChild(toAdd);
		//>
		//<scalebar_label
		var $ctrlPtContainer_scalebar_label = $("<div id='gradientPicker-scalebar_label'; class='gradientPicker-ctrlPts_scalebar_label'></div>");
		this.$el.append($ctrlPtContainer_scalebar_label);
		var toAdd = document.createDocumentFragment();
		for (i = 0; i <this.opts.controlTicks.length; i++) { 
			var newDiv = document.createElement('div');
			newDiv.id = 'sline'+i;
			var newContent = document.createTextNode(this.opts.controlTicks[i]); 
			newDiv.appendChild(newContent);
			newDiv.style.left = ((this.g2d.canvas.width*this.opts.controlProcent[i])-25)+'px';
			newDiv.className = 'gradientPicker-ctrlPts_scalemarks_label';
			toAdd.appendChild(newDiv);
		}
		document.getElementById('gradientPicker-scalebar_label').appendChild(toAdd);
		//>
		
		this.updatePreview = bind(this.updatePreview, this);

		this.ctrlPts = [];
		this.ctrlPtConfig = new ControlPtConfig(this.$el, opts);
		for (var i = 0; i < this.opts.controlProcent.length; ++i) {
			var ctrlPt = this.createCtrlPt({position: this.opts.controlProcent[i], color: opts.controlColors[i]});
			this.ctrlPts.push(ctrlPt);
		}
		console.log("new G ctrlPts:")
		console.log(this.ctrlPts)
		
		this.docClicked = bind(this.docClicked, this);
		this.destroyed = bind(this.destroyed, this);
		$(document).bind("click", this.docClicked);
		this.$el.bind("destroyed", this.destroyed);
		this.previewClicked = bind(this.previewClicked, this);
		$preview.click(this.previewClicked);

		result = this.updatePreview();
		this.opts.change(result); // new
	}

	GradientSelection.prototype = {
		docClicked: function() {
			this.ctrlPtConfig.hide();
		},

		createCtrlPt: function(ctrlPtSetup) {
			return new ControlPoint(this.$ctrlPtContainer, ctrlPtSetup, this.opts.orientation, this, this.ctrlPtConfig, this.opts)
		},
		
		destroyed: function() {
			$(document).unbind("click", this.docClicked);
		},

		updateOptions: function(opts) {
		$.extend(this.opts, opts);
			this.opts = opts;
			console.log('updateOptions:')
			console.log(opts)
			console.log(this.opts)
			console.log('<<')
			this.updatePreview();
		},

		updatePreview: function() {
			console.log('updatePreview:')
			console.log(this.ctrlPts)
			var result = [];
			this.ctrlPts = this.ctrlPts.sort(ctrlPtComparator); // sort colorboxes by position
			
			console.log(this.opts.controlProcent)
			if (this.opts.orientation == "horizontal") {
				var grad = this.g2d.createLinearGradient(0, 0, this.g2d.canvas.width, 0);
			//	var delta = this.opts.controlTicks[this.opts.controlTicks.length-1] - this.opts.controlTicks[0]
				var delta = this.opts.max_value - this.opts.min_value
				console.log(delta)
			//	for (var i = 0; i < this.opts.controlProcent.length; ++i) {
			//	var pt = {position:this.opts.controlProcent[i], color: this.opts.controlColors[i]};
			//		if(pt.position>1){
			//			console.log('correct')
			//			pt.position = Math.floor(pt.position); // somehow pt.position is sometime greater 1.00X
			//		}
				var controlProcent = []
				var controlTicks = []
				var controlColors = []	
				for (var i = 0; i < this.ctrlPts.length; ++i) {	
					pt = this.ctrlPts[i];
					grad.addColorStop(pt.position, pt.color);
					console.log(pt.position)
					controlProcent.push(pt.position)
					controlTicks.push((this.opts.min_value + (delta*pt.position)))
					controlColors.push(pt.color)
					result.push({
						position: controlProcent[i],
					color: controlColors[i],
					ticks: controlTicks[i]
					});
				}
				this.opts.controlProcent = controlProcent
				this.opts.controlTicks = controlTicks
				this.opts.controlColors = controlColors	
				if(result[0].position>0){
					var r0 = {position: 0, color: result[0].color, ticks: this.opts.min_value}
					result.unshift(r0);
				}
				if(result[result.length-1].position<1){
					var rn = {position: 1, color: result[result.length-1].color, ticks: this.opts.max_value}
					result.push(rn);
				}
				
			} else {

			}

			this.g2d.fillStyle = grad;
			this.g2d.fillRect(0, 0, this.g2d.canvas.width, this.g2d.canvas.height);
			return(result)
		},

		removeControlPoint: function(ctrlPt) {
			console.log('id: ')
			console.log(ctrlPt)
			console.log(this.ctrlPts)
			var cpidx = this.ctrlPts.indexOf(ctrlPt)
			console.log(cpidx)
			if (cpidx != -1) {
				this.ctrlPts.splice(cpidx, 1);
				ctrlPt.$el.remove();
			}
		},

		previewClicked: function(e) {
			var offset = $(e.target).offset();
			var x = e.pageX - offset.left;
			var y = e.pageY - offset.top;

			var imgData = this.g2d.getImageData(x,y,1,1);
			var colorStr = "rgb(" + imgData.data[0] + "," + imgData.data[1] + "," + imgData.data[2] + ")";

			
			console.log('createCtrlPt: ')
			var cp = this.createCtrlPt({
				position: (x / this.g2d.canvas.width),  // -6
				color: colorStr
			});
			this.ctrlPts.push(cp);
			result = this.updatePreview();
			this.opts.change(result)
			this.opts.controlProcent.push(cp);
			this.opts.controlProcent.sort(ctrlPtComparator);
		}
	};

	function ControlPoint($parentEl, initialState, orientation, listener, ctrlPtConfig, opts) {
		
		this.opts = opts;
		this.$el = $("<div class='gradientPicker-ctrlPt'></div>");
		$parentEl.append(this.$el);
		this.$parentEl = $parentEl;
		this.configView = ctrlPtConfig;

		this.position = initialState.position; 
		this.color = initialState.color;
		
		this.listener = listener;
		this.outerWidth = this.$el.outerWidth();
		this.$el.css("background-color", this.color);
		if (orientation == "horizontal") {
			var pxLeft = ($parentEl.width() * (this.position)) - (this.$el.outerWidth()/2);
			this.$el.css("left", pxLeft);
		} else {
			var pxTop = ($parentEl.height() * (this.position)) - (this.$el.outerHeight()/2);
			this.$el.css("top", pxTop);
		}
		
		this.drag = bind(this.drag, this);
		this.stop = bind(this.stop, this, this.opts);
		this.clicked = bind(this.clicked, this);
		this.dbclicked = bind(this.dbclicked, this);
		//this.drop = bind(this.dropPoint, this);
		this.colorChanged = bind(this.colorChanged, this);
		this.$el.draggable({
			axis: (orientation == "horizontal") ? "x" : "y",
			drag: this.drag,
			stop: this.stop,
			containment: $parentEl
		});
		this.$el.css("position", 'absolute');
		this.$el.click(this.clicked);
		this.$el.dblclick(this.dbclicked);
		//this.$el.on("drop",this.dropPoint);
	}

	ControlPoint.prototype = {
		drag: function(e, ui) {
			// convert position to a %
			var left = ui.position.left;
			this.position = (left / (this.$parentEl.width() - this.outerWidth));
			this.listener.updatePreview();
			
		},
		stop: function(e, ui) {
			//this.opts.change('TRUE');
			var result = this.listener.updatePreview();
			this.opts.change(result);
			//this.opts.drop('TRUE');
			//this.listener.updatePreview();
			//this.configView.show(this.$el.position(), this.color, this);
			e.stopPropagation();
		},

		clicked: function(e) {
		//	this.configView.show(this.$el.position(), this.color, this);
		//	e.preventDefault();
			e.stopPropagation();
			return false;
		},
		/*
		dropPoint: function(e) {
			alert('drop');
			//e.preventDefault();
			e.stopPropagation();
			return false;
		},
		*/
		dbclicked: function(e) {
			this.configView.show(this.$el.position(), this.color, this);
			e.preventDefault();
			e.stopPropagation();
			//alert('dbclicked');
			return false;
		},

		colorChanged: function(c) {
			this.color = c;
			this.$el.css("background-color", this.color);
			var result = this.listener.updatePreview();
			this.opts.change(result);
		},

		removeClicked: function() {
			//console.log(this)
			this.listener.removeControlPoint(this);
			var result = this.listener.updatePreview();
			this.opts.change(result);
		}
	};

	function ControlPtConfig($parent, opts) {
		//color-chooser
		this.$el = $('<div class="gradientPicker-ptConfig" style="visibility: hidden"></div>');
		$parent.append(this.$el);
		var $cpicker = $('<div class="color-chooser"></div>');
		this.$el.append($cpicker);
		var $rmEl = $("<div class='gradientPicker-close'></div>");
		this.$el.append($rmEl);

		this.colorChanged = bind(this.colorChanged, this);
		this.removeClicked = bind(this.removeClicked, this);
		$cpicker.ColorPicker({
			onChange: this.colorChanged
		});
		this.$cpicker = $cpicker;
		this.opts = opts;
		this.visible = false;

		$rmEl.click(this.removeClicked);
	}

	ControlPtConfig.prototype = {
		show: function(position, color, listener) {
			this.visible = true;
			this.listener = listener;
			this.$el.css("visibility", "visible");
			this.$cpicker.ColorPickerSetColor(color);
			this.$cpicker.css("background-color", color);
			if (this.opts.orientation === "horizontal") {
				this.$el.css("left", position.left);
			} else {
				this.$el.css("top", position.top);
			}
			//else {
			//	this.visible = false;
				//this.$el.css("visibility", "hidden");
			//}
		},

		hide: function() {
			if (this.visible) {
				this.$el.css("visibility", "hidden");
				this.visible = false;
			}
		},

		colorChanged: function(hsb, hex, rgb) {
			hex = "#" + hex;
			this.listener.colorChanged(hex);
			this.$cpicker.css("background-color", hex)
		},

		removeClicked: function() {
			this.listener.removeClicked();
			this.hide();
		}
	};

	var methods = {
		init: function(opts) {
			console.log('init')
			console.log(opts)
			opts = $.extend({
				controlProcent: ["#FFF 0%", "#000 100%"],
				orientation: "horizontal",
				type: "linear",
				fillDirection: "left",
				generateStyles: true,
				change: function() {}
			}, opts); // adding the opts again will overwrite the pre defined opts
			opts = $.extend({min_value: opts.controlTicks[0] , max_value:opts.controlTicks[opts.controlTicks.length-1]},opts)
			console.log(opts)
			/* function can be used to iterate over any collection, 
			whether it is an object or an array. In the case of an 
			array, the callback is passed an array index and a 
			corresponding array value each time.*/
			this.each(function() {
				var $this = $(this);
				//var gradSel = new GradientSelection($this, opts);
				var gradSel = $this.data("gradientPicker-sel"); // ToDo
				
				if (gradSel == null) {							// ToDo
					console.log('new init')
					var gradSel = new GradientSelection($this, opts);// ToDo
					$this.data("gradientPicker-sel", gradSel);
				}else{// ToDo
				debugger;
					console.log('new update')
					document.getElementById('gradientPicker-ctrlPts_container').remove();
					document.getElementById('gradientPicker-scalebar_line').remove();
					document.getElementById('gradientPicker-scalebar_label').remove();
					document.getElementById('gradientPicker-ctrlPts_preview').remove();
					
					var gradSel = $this.data("gradientPicker-sel");
					var gradSel = new GradientSelection($this, opts);// ToDo
					$this.data("gradientPicker-sel", gradSel);
				}// ToDo
				//$this.data("gradientPicker-sel", gradSel);
			});
		},

		update: function(opts) {
			console.log('update')
			this.each(function() {
				var $this = $(this);
				var gradSel = $this.data("gradientPicker-sel");
				if (gradSel != null) {
					opts = $.extend({min_value: opts.controlTicks[0] , max_value:opts.controlTicks[opts.controlTicks.length-1]},opts)
					gradSel.updateOptions(opts);
				}
			});
		}
	};

	$.fn.gradientPicker = function(method, opts) {
		console.log('$.fn.gradientPicker:')
		console.log(method)
		if (typeof method === "string" && method !== "init") {
			methods[method].call(this, opts);
		} else {
			opts = method;
			methods.init.call(this, opts);
		}
	};
})( jQuery );