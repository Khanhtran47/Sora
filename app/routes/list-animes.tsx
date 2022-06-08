import * as React from "react"
import { Link } from "remix"
import Typography from "@mui/material/Typography"

interface IListAnimesProps {}

const ListAnimes: React.FC<IListAnimesProps> = (props: IListAnimesProps) => {
  const {} = props
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        List Animes Page
      </Typography>
      <Link to="/anime" color="secondary">
        Go to the anime detail page
      </Link>
    </>
  )
}

export default ListAnimes
