# library("devtools")
# setwd("D:/git")
# devtools::create("gradientPickerD3")    
# setwd("D:/git/gradientPickerD3")
# htmlwidgets::scaffoldWidget("gradientPickerD3")

setwd("D:/git/gradientPickerD3")
devtools::document()
devtools::install()   
library('gradientPickerD3')
library("clustpro")
payload <- list(colors=c("purple 0%","blue 25%", "green 50%", "yellow 75%", "red 100%"),test='test')
gradientPickerD3(payload)


# payload <- list(colors=c("purple 0%","blue 25%", "green 50%", "yellow 75%", "pink 100%"),test='test')
# gradientPickerD3(payload)





colorRampPalette(c("blue", "red"))( 4 ) 
rRampPalette(c("blue", "red"))( 4 ) 

m <- outer(1:20,1:20,function(x,y) sin(sqrt(x*y)/3))
rgb.palette <- colorRampPalette(c("red", "orange", "blue"),space = "rgb")
filled.contour(m, col = rgb.palette(20))
