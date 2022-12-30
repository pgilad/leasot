library("dplyr")
library("magrittr")

agg_mtcars <- function(data) {
  # TODO: Make this better
  out_data <- data %>%
    group_by(cyl) %>%
    summarise(
      avg_hp = mean(hp)
    )
  
  return(out_data)
}

# FIXME: Don't call function in library script
agg_mtcars(mtcars) 