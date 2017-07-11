#' Example 1
#'
#' starts a test shiny app
#' @importFrom shiny runApp
#' @export
runExample <- function() {
  appDir <- system.file("shiny-examples", package = "gradientPickerD3")
  if (appDir == "") {
    stop("Could not find example directory. Try re-installing `gradientPickerD3`.", call. = FALSE)
  }

  shiny::runApp(appDir, display.mode = "normal")
}
