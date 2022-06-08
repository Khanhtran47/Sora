import * as React from "react"
import { Link } from "remix"
import Typography from "@mui/material/Typography"

interface ITvShowProps {}

const TvShow: React.FC<ITvShowProps> = (props: ITvShowProps) => {
  const {} = props
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        TvShow Detail Page
      </Typography>
    </>
  )
}

export default TvShow
