import { useSelector } from "react-redux"
import { RootState } from "../app/store"
import { Box, Typography } from "@mui/material"
import NavigationIcon from "@mui/icons-material/Navigation"

const PageTitle: React.FC = () => {
  const pageTitle = useSelector((state: RootState) => state.modal.pageTitle)

  return (
    <Box
      sx={{
        width: "100%",
        padding: 1,
        background: "#ced9e8",
        borderRadius: "4px",
        display: "flex", 
        alignItems: "center"
      }}
    >
      <NavigationIcon sx={{ transform: "rotate(90deg)", color: "#333" }} />
      &nbsp;
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: 600,
          color: "#4a4a4a",
        }}
      >
        {pageTitle}
      </Typography>
    </Box>
  )
}

export default PageTitle
