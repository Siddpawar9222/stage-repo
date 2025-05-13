import * as React from "react"
import type { Theme, CSSObject } from "@mui/material/styles"
import { styled, useTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import MuiDrawer from "@mui/material/Drawer"
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"
import MuiAppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import List from "@mui/material/List"
import QuizIcon from "@mui/icons-material/Quiz"
import CssBaseline from "@mui/material/CssBaseline"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ListItem from "@mui/material/ListItem"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  AccountCircle as AccountCircleIcon,
  Edit as EditIcon,
  CardMembership as CertificateIcon,
  Payments as PaymentsIcon,
  LibraryBooks as LibraryBooks,
  AccountCircle,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Subject,
  LocalAtm
} from "@mui/icons-material"
import type { RootState } from "../app/store"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useRole } from "../RoleContext"
import { useState } from "react"
import { logout } from "../features/auth/authSlice"
import { Avatar, Menu, MenuItem } from "@mui/material"
import { roles } from "../utils/roles"
import { roleNameMap } from "../utils/roleMappings"

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}))

export default function Sidebar() {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [quizOpen, setQuizOpen] = useState(false)

  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { setUserRole } = useRole()
  const username = localStorage.getItem("userName")
  const rawRole = localStorage.getItem("userRole")

  const displayName = rawRole ? roleNameMap[rawRole] || rawRole : "User"

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const menuOpen = Boolean(anchorEl)

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("jwtToken")
    localStorage.removeItem("roles")
    localStorage.removeItem("studentId")
    setUserRole(null)
    navigate("/")
  }

  const getSidebarItems = () => {
    if (!user) return []

    if (
      user.roles.includes(roles.admin[0]) ||
      user.roles.includes(roles.admin[1])
    ) {
      return [
        { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
        { text: "Students", path: "/students", icon: <SchoolIcon /> },
        { text: "Attendance", path: "/attendence", icon: <AssignmentIcon /> },
        { text: "Class Subjects", path: "/subjects", icon: <Subject /> },
        { text: "Class Chapters", path: "/chapters", icon: <LibraryBooks /> },
        {
          text: "Class Charges",
          path: "/classCharges",
          icon: <PaymentsIcon />,
        },
        {
          text: "Student Payment",
          path: "/studentPayment",
          icon: <LocalAtm />,
        },
        { text: "Class Dues", path: "/classDue", icon: <ReceiptIcon /> },
        { text: "Reports", path: "/reports", icon: <AssessmentIcon /> },
      ]
    }
    if (user.roles.includes(roles.operator[0])) {
      return [
        { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
        { text: "Students", path: "/students", icon: <SchoolIcon /> },
        { text: "Class Subjects", path: "/subjects", icon: <Subject /> },
        { text: "Class Chapters", path: "/chapters", icon: <LibraryBooks /> },
        {
          text: "Class Charges",
          path: "/classCharges",
          icon: <PaymentsIcon />,
        },
        {
          text: "Student Payment",
          path: "/studentPayment",
          icon: <LocalAtm />,
        },
        { text: "Class Dues", path: "/classDue", icon: <ReceiptIcon /> },
        { text: "Reports", path: "/reports", icon: <AssessmentIcon /> },
      ]
    }
    if (user.roles.includes(roles.teacher[0])) {
      return [
        { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
        { text: "Students", path: "/students", icon: <PeopleIcon /> },
        { text: "Attendance", path: "/attendence", icon: <AssignmentIcon /> },
        { text: "Class Subjects", path: "/subjects", icon: <Subject /> },
        { text: "Class Chapters", path: "/chapters", icon: <LibraryBooks /> },
        {
          text: "Quiz",
          // path: "/quiz",
          icon: <QuizIcon />,
          subItems: [
            { text: "Mark Entry", path: "/quiz/mark-entry" },
            { text: "Display Quiz", path: "/quiz/display-quiz-marks" },
            // { text: "Online Quiz", path: "/quiz/online-quiz" },
          ],
        },
      ]
    }
    if (user.roles.includes(roles.student[0])) {
      return [
        { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
        { text: "Profile", path: "/profile", icon: <AccountCircleIcon /> },
        { text: "Attendence", path: "/attendance", icon: <AssignmentIcon /> },
        { text: "Payment Details", path: "/payment", icon: <LocalAtm /> },
        { text: "My Quiz", path: "/quiz/online-quiz", icon: <QuizIcon /> },
        { text: "Course Enrolled", path: "/course-enrollment", icon: <AssignmentIcon /> },
      ]
    }
    return []
  }
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleProfile = () => {
    navigate("/profile")
    handleClose()
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  marginRight: 5,
                },
                open && { display: "none" },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              SSIK
            </Typography>
          </div>
          {user && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography>
                Welcome {username ?? "User"} ! &nbsp;
                <span style={{ fontSize: "12px" }}>
                  (&nbsp;{displayName} &nbsp;)
                </span>
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar>
                  <AccountCircle />
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={menuOpen}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>My Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box sx={{ display: "flex", alignItems: "center", margin: "0 auto" }}>
            <IconButton disabled>
              <DashboardIcon
                sx={{
                  color: theme.palette.mode === "dark" ? "white" : "black",
                  fontSize: "44px",
                  marginLeft: "30px",
                }}
              />
            </IconButton>
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {getSidebarItems().map(item => (
            <React.Fragment key={item.text}>
              {item.subItems ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        setQuizOpen(!quizOpen)
                        if (!open) setOpen(true) // Open the sidebar if it's closed
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                      {quizOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}{" "}
                      {/* Expand/Collapse Icon */}
                    </ListItemButton>
                  </ListItem>
                  {quizOpen && // ✅ Show sub-items only when quizOpen is true
                    item.subItems.map(subItem => (
                      <ListItem
                        key={subItem.text}
                        sx={{ pl: 4 }}
                        disablePadding
                      >
                        <ListItemButton component={Link} to={subItem.path}>
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </>
              ) : (
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </Box>
  )
}
