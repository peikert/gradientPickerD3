HTMLWidgets.widget({

  name: 'gradientPickerD3',

  type: 'output',

     initialize: function (el, width, height) {
        console.log("-- Entered initialize() --");
     },

renderValue: function (el, x, instance) {
        console.log("-- Entered renderValue() --");
    // console.log(x)
    //  console.log(x.colors)
      
    //var colors =  ["purple 0%","blue 25%", "green 50%", "yellow 75%", "red 100%"]
     var colors =  x.colorstring
     
     
     
   // console.log(colors);
      
 //     $( el ).append( "<p id='p1'>Test1</p>" );
    
			$(el).gradientPicker({
				change: function(points, styles) { // styles include standard style and browser-prefixed style
				  
				  if (HTMLWidgets.shinyMode) {
          console.log(el.id)
				  Shiny.onInputChange(
                el.id + "_selected",
                styles
              );
				  }
//					for (i = 0; i < styles.length; ++i) {
//					  $('#p1').css("background-image", styles[i]);
//					}
		//$('#p1').css("background-image", styles[1]);
				},
		//	controlPoints: ["purple 0%","blue 25%", "green 50%", "yellow 75%", "red 100%"]
		//	controlPoints: ["blue 0%", "yellow 50%", "red 100%"]

		controlPoints: colors,
	  controlColors: x.colors,
	  controlTicks: x.ticks,
	  controlProcent: x.procent
			});

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }
});