import React, { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import Sidebar from "./Sidebar"
import { Box, styled, ThemeProvider} from "@mui/material"
import { useRole } from "../RoleContext"
import { lightTheme, darkTheme } from "../utils/theme"
import { roles } from "../utils/roles"
import ModalLayout from "../features/modal-layout/ModalLayout"
import SnackbarNotification from "./Snackbar"
import { useAppDispatch } from "../app/hooks"
import { fetchSessions } from "../app/reducers/sessionSlice"

const MainContent = styled(Box)(({ theme }) => ({
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: "100%",
}))

const Layout: React.FC = () => {
  const location = useLocation()
  const showSidebar = location.pathname !== "/"
  const { userRole } = useRole()
  const [currentTheme, setCurrentTheme] = useState(lightTheme)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userRole) {
      if (userRole === roles.teacher[0] || userRole === roles.operator[0]) {
        setCurrentTheme(lightTheme)
      } else if (roles.admin.includes(userRole)) {
        setCurrentTheme(darkTheme)
      } else {
        setCurrentTheme(lightTheme) // Default if invalid role
      }

      dispatch(fetchSessions()); // set session
    } else {
      setCurrentTheme(lightTheme) // Default if no role
    }
  }, [userRole,dispatch])

  return (
    <ThemeProvider theme={currentTheme}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh"}}>
        <Header styles={undefined} />
        <ModalLayout />
        <SnackbarNotification />
        <Box sx={{ display: "flex", flexGrow: 1, marginTop: "30px"  }}>
          {showSidebar && <Sidebar />}
          <MainContent sx={{ margin: "0 40px" }}>
            <Outlet />
          </MainContent>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default Layout;
