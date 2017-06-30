#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library('gradientPickerD3')
library("clustpro")
library('stringr')
# detach("package:clustpro", unload=TRUE)
# Define UI for application that draws a histogram
ui <- fluidPage(
   
   # Application title
   titlePanel("Old Faithful Geyser Data"),
   
   # Sidebar with a slider input for number of bins 
   sidebarLayout(
      sidebarPanel(
        
      ),
      
      # Show a plot of the generated distribution
      mainPanel(
        div(style='width: 300px;overflow-x: scroll;',
          div(style='width: 5000px;overflow:scroll;',gradientPickerD3Output('gpD3'))
        )
      )
   )
)

# Define server logic required to draw a histogram
server <- function(input, output) {
   

  payload <- list(colors=c("purple 0%","blue 25%", "green 50%", "yellow 75%", "red 100%"),test='test')
  output$gpD3 <- renderGradientPickerD3( gradientPickerD3(payload))
 
 test <- reactive({
    req(input$gpD3_selected)
  #  req(input$gpD3_selected())
    gcolors <- input$gpD3_selected
    print(class(gcolors))
  #  [1]
 #   gcolors <- 'linear-gradient(left, purple 0%, blue 24%, green 52%, yellow 74%, red 100%)'

     if(is.null(gcolors)) return(NULL)
       df_gcolors <- as.data.frame(str_match_all(gcolors,'([a-z]+) (\\d{1,3})%')[[1]][,2:3],stringsAsFactors=FALSE)
       print(df_gcolors)
       colnames(df_gcolors) <- c("color","interval")
       setHeatmapColors(data=NULL,color_list=df_gcolors$color,intervals=as.numeric(df_gcolors$interval))
      
    #   df_gcolors
    })
 observe(test())
}

# Run the application 
shinyApp(ui = ui, server = server)

