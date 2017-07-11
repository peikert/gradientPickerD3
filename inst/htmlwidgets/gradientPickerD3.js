HTMLWidgets.widget({

  name: 'gradientPickerD3',

  type: 'output',

     initialize: function (el, width, height) {
        console.log("-- Entered initialize() --");
     },

renderValue: function (el, x, instance) {
        console.log("-- Entered renderValue() --");
       
			$(el).gradientPicker({
				change: function(points) { 
				  if (HTMLWidgets.shinyMode) {

				  Shiny.onInputChange(
                el.id + "_selected",
                points
              );
              
             Shiny.onInputChange(
                el.id + "_drop",
                points
              );  
				  }
				},
		controlPoints: x.colorstring,
	  controlColors: x.colors,
	  controlTicks: x.ticks,
	  controlProcent: x.procent
			});
      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }
});