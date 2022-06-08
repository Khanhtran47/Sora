import * as React from "react"
import { Link } from "remix"
import Typography from "@mui/material/Typography"

interface IMovieProps {}

const Movie: React.FC<IMovieProps> = (props: IMovieProps) => {
  const {} = props
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Movie Detail Page
      </Typography>
    </>
  )
}

export default Movie
