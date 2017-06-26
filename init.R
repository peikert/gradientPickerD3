# library("devtools")
# setwd("D:/git")
# devtools::create("gradientPickerD3")    
# setwd("D:/git/gradientPickerD3")
# htmlwidgets::scaffoldWidget("gradientPickerD3")

setwd("D:/git/gradientPickerD3")
devtools::document()
devtools::install()   
library('gradientPickerD3')
gradientPickerD3("hello, world")



