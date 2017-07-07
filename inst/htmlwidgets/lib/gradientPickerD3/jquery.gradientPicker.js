/**
@author Matt Crinklaw-Vogt (tantaman)
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

		var $preview = $("<canvas class='gradientPicker-preview'></canvas>");
		this.$el.append($preview);
		var canvas = $preview[0];
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		this.g2d = canvas.getContext("2d");

		var $ctrlPtContainer = $("<div class='gradientPicker-ctrlPts'></div>");
		this.$el.append($ctrlPtContainer)
		this.$ctrlPtContainer = $ctrlPtContainer;
		
		
		// <add scale bar>
		

		var $ctrlPtContainer_scalebar_line = $("<div id='scalebar_line'; class='gradientPicker-ctrlPts_scalebar_line'></div>");
		this.$el.append($ctrlPtContainer_scalebar_line);
		var toAdd = document.createDocumentFragment();
		//width_step = canvas.width/4;
		//for (i = 0; i <5; i++) { 
		controlProcent = opts.controlProcent
		controlTicks = opts.controlTicks
		for (i = 0; i <controlTicks.length; i++) { 
		
		var newDiv = document.createElement('div');
		newDiv.id = 'sline'+i;
		
		/*
		if(i==0){
			newDiv.style.left = 0+'px';
			newDiv.className = 'gradientPicker-ctrlPts_scalemarks_line_left';
			}
		else if(i<4){
			newDiv.style.left = ((width_step*i)-1)+'px';
			newDiv.className = 'gradientPicker-ctrlPts_scalemarks_line_middle';
			}
		else{
			newDiv.style.left = (canvas.width-2)+'px';
			newDiv.className = 'gradientPicker-ctrlPts_scalemarks_line_right';
			}
		*/	
		newDiv.style.left = ((this.g2d.canvas.width*controlProcent[i])-1)+'px';
		newDiv.className = 'gradientPicker-ctrlPts_scalemarks_line';
		
		toAdd.appendChild(newDiv);
		}
		document.getElementById('scalebar_line').appendChild(toAdd);
		
		
		var $ctrlPtContainer_scalebar_label = $("<div id='scalebar_label'; class='gradientPicker-ctrlPts_scalebar_label'></div>");
		this.$el.append($ctrlPtContainer_scalebar_label);
		var toAdd = document.createDocumentFragment();
		//width_step = canvas.width/4;
		//console.log(opts.controlProcent)
		controlProcent = opts.controlProcent
		controlTicks = opts.controlTicks
		for (i = 0; i <controlTicks.length; i++) { 
		
		var newDiv = document.createElement('div');
		newDiv.id = 'sline'+i;
		
		//var newContent = document.createTextNode(((i*25)+"%")); 
		var newContent = document.createTextNode(controlTicks[i]); 
		
		newDiv.appendChild(newContent);
	//	if(i>1){console.log($('#slabel'+(i-1)))};
		
		/*
		if(i==0){
			newDiv.style.left = 0+'px';
			newDiv.className = 'gradientPicker-ctrlPts_scalemarks_left';
			}
		else if(i<4){
			newDiv.style.left = ((width_step*i)-25)+'px';
			newDiv.className = 'gradientPicker-ctrlPts_scalemarks_middle';
			}
		else{
			newDiv.style.left = (canvas.width-50)+'px';
			newDiv.className = 'gradientPicker-ctrlPts_scalemarks_right';
			}
		*/
			newDiv.style.left = ((this.g2d.canvas.width*controlProcent[i])-25)+'px';
			newDiv.className = 'gradientPicker-ctrlPts_scalemarks_label';

		

		toAdd.appendChild(newDiv);
		}
		document.getElementById('scalebar_label').appendChild(toAdd);
		
		
		
		
		
		
		

		
		
		
		
		
		
		
		
		//</>
		
		this.updatePreview = bind(this.updatePreview, this);
		this.controlProcent = [];
		this.ctrlPtConfig = new ControlPtConfig(this.$el, opts);
		for (var i = 0; i < opts.controlProcent.length; ++i) {
			//console.log(opts.controlProcent[i])
			//console.log(this.g2d.canvas.width*opts.controlProcent[i])
			//var pos = this.g2d.canvas.width*opts.controlProcent[i]//-6
			var pos = opts.controlProcent[i]
			//console.log(pos)
			var ctrlPt = this.createCtrlPt({position: pos, color: opts.controlColors[i]});
			this.controlProcent.push(ctrlPt);
		}

		this.docClicked = bind(this.docClicked, this);
		this.destroyed = bind(this.destroyed, this);
		$(document).bind("click", this.docClicked);
		this.$el.bind("destroyed", this.destroyed);
		this.previewClicked = bind(this.previewClicked, this);
		$preview.click(this.previewClicked);

		this.updatePreview();
	}

	GradientSelection.prototype = {
		docClicked: function() {
			this.ctrlPtConfig.hide();
		},

		createCtrlPt: function(ctrlPtSetup) {
			return new ControlPoint(this.$ctrlPtContainer, ctrlPtSetup, this.opts.orientation, this, this.ctrlPtConfig)
		},
		
		destroyed: function() {
			$(document).unbind("click", this.docClicked);
		},

		updateOptions: function(opts) {
			$.extend(this.opts, opts);
			this.updatePreview();
		},

		updatePreview: function() {
			var result = [];
			this.controlProcent.sort(ctrlPtComparator);
			if (this.opts.orientation == "horizontal") {
				var grad = this.g2d.createLinearGradient(0, 0, this.g2d.canvas.width, 0);
				for (var i = 0; i < this.controlProcent.length; ++i) {
					var pt = this.controlProcent[i];
					grad.addColorStop((pt.position), pt.color);
					result.push({
						position: pt.position,
						color: pt.color
					});
				}
			} else {

			}

			this.g2d.fillStyle = grad;
			this.g2d.fillRect(0, 0, this.g2d.canvas.width, this.g2d.canvas.height);

			if (this.opts.generateStyles)
				var styles = this._generatePreviewStyles();

			this.opts.change(result, styles,this.opts.controlTicks);
		},

		removeControlPoint: function(ctrlPt) {
			console.log(ctrlPt)
			var cpidx = this.controlProcent.indexOf(ctrlPt);
			console.log(cpidx)
			if (cpidx != -1) {
				this.controlProcent.splice(cpidx, 1);
				ctrlPt.$el.remove();
			}
		},

		previewClicked: function(e) {
			var offset = $(e.target).offset();
			var x = e.pageX - offset.left;
			var y = e.pageY - offset.top;

			var imgData = this.g2d.getImageData(x,y,1,1);
			var colorStr = "rgb(" + imgData.data[0] + "," + imgData.data[1] + "," + imgData.data[2] + ")";

			var cp = this.createCtrlPt({
				position: (x / this.g2d.canvas.width),  // -6
				color: colorStr
			});

			this.controlProcent.push(cp);
			this.controlProcent.sort(ctrlPtComparator);
		},

		_generatePreviewStyles: function() {
			//linear-gradient(top, rgb(217,230,163) 86%, rgb(227,249,159) 9%)
			var str = this.opts.type + "-gradient(" + ((this.opts.type == "linear") ? (this.opts.fillDirection + ", ") : "");
			var first = true;
			for (var i = 0; i < this.controlProcent.length; ++i) {
				var pt = this.controlProcent[i];
				if (!first) {
					str += ", ";
				} else {
					first = false;
				}
				str += pt.color + " " + ((pt.position/this.g2d.canvas.width*100)|0) + "%";
			}

			str = str + ")"
			console.log(str)
			var styles = [str, browserPrefix + str];
			return styles;
		}
	};

	function ControlPoint($parentEl, initialState, orientation, listener, ctrlPtConfig) {

		console.log(initialState)
		console.log(orientation)

		this.$el = $("<div class='gradientPicker-ctrlPt'></div>");
		$parentEl.append(this.$el);
		this.$parentEl = $parentEl;
		this.configView = ctrlPtConfig;

		this.position = initialState.position; //this.g2d.canvas.width;
		this.color = initialState.color;
		
		this.listener = listener;
		this.outerWidth = this.$el.outerWidth();
		console.log(':::::')
		console.log(($parentEl.width() * (this.position)) - (this.$el.outerWidth()/2))
		console.log(($parentEl.width() * (this.position)))
		console.log(':::::')
		this.$el.css("background-color", this.color);
		if (orientation == "horizontal") {
			var pxLeft = ($parentEl.width() * (this.position)) - (this.$el.outerWidth()/2);
			this.$el.css("left", pxLeft);
		} else {
			var pxTop = ($parentEl.height() * (this.position)) - (this.$el.outerHeight()/2);
			this.$el.css("top", pxTop);
		}
		
		this.drag = bind(this.drag, this);
		this.stop = bind(this.stop, this);
		this.clicked = bind(this.clicked, this);
		this.colorChanged = bind(this.colorChanged, this);
		this.$el.draggable({
			axis: (orientation == "horizontal") ? "x" : "y",
			drag: this.drag,
			stop: this.stop,
			containment: $parentEl
		});
		this.$el.css("position", 'absolute');
		this.$el.click(this.clicked);
	}

	ControlPoint.prototype = {
		drag: function(e, ui) {
			// convert position to a %
			var left = ui.position.left;
			this.position = (left / (this.$parentEl.width() - this.outerWidth));
			this.listener.updatePreview();
		},

		stop: function(e, ui) {
			this.listener.updatePreview();
			this.configView.show(this.$el.position(), this.color, this);
		},

		clicked: function(e) {
			this.configView.show(this.$el.position(), this.color, this);
			e.stopPropagation();
			return false;
		},

		colorChanged: function(c) {
			this.color = c;
			this.$el.css("background-color", this.color);
			this.listener.updatePreview();
		},

		removeClicked: function() {
			this.listener.removeControlPoint(this);
			this.listener.updatePreview();
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
			opts = $.extend({
				controlProcent: ["#FFF 0%", "#000 100%"],
				orientation: "horizontal",
				type: "linear",
				fillDirection: "left",
				generateStyles: true,
				change: function() {}
			}, opts);

			this.each(function() {
				var $this = $(this);
				var gradSel = new GradientSelection($this, opts);
				$this.data("gradientPicker-sel", gradSel);
			});
		},

		update: function(opts) {
			this.each(function() {
				var $this = $(this);
				var gradSel = $this.data("gradientPicker-sel");
				if (gradSel != null) {
					gradSel.updateOptions(opts);
				}
			});
		}
	};

	$.fn.gradientPicker = function(method, opts) {
		if (typeof method === "string" && method !== "init") {
			methods[method].call(this, opts);
		} else {
			opts = method;
			methods.init.call(this, opts);
		}
	};
})( jQuery );