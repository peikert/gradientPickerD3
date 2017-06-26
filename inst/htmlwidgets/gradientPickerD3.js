HTMLWidgets.widget({

  name: 'gradientPickerD3',

  type: 'output',

  factory: function(el, width, height) {

    return {

      renderValue: function(x) {


      $( el ).append( "<p id='p1'>Test1</p>" );
      $( el ).append( "<p id='p2'>Test2</p>" );
			$(el).gradientPicker({
				change: function(points, styles) { // styles include standard style and browser-prefixed style
					for (i = 0; i < styles.length; ++i) {
					  $('#p1').css("background-image", styles[i]);
					}
				},
				controlPoints: ["green 0%", "yellow 50%", "green 100%"]
			});

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});