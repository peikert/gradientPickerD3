#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
gradientPickerD3 <- function(message, width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x = list(
    message = message
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'gradientPickerD3',
    x,
    width = width,
    height = height,
    package = 'gradientPickerD3',
    elementId = elementId
  )
}

#' Shiny bindings for gradientPickerD3
#'
#' Output and render functions for using gradientPickerD3 within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a gradientPickerD3
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name gradientPickerD3-shiny
#'
#' @export
gradientPickerD3Output <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'gradientPickerD3', width, height, package = 'gradientPickerD3')
}

#' @rdname gradientPickerD3-shiny
#' @export
renderGradientPickerD3 <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, gradientPickerD3Output, env, quoted = TRUE)
}