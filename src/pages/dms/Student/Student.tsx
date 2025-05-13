import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
  useTheme,
  InputAdornment,
  TextField,
  Button,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import StudentGrid from "./StudentGrid"
import { MODAL_CONSTANTS } from "../../../utils/modalUtils"
import { openModal, setPageTitle } from "../../../app/reducers/modalSlice"
import { fetchAllClassesApi } from "../../../services/apis/dms/studentService"
import PageTitle from "../../../components/PageTitle"
import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import SessionFilter from "../../../components/comman/SessionFilter"

// Define types for Class object
interface ClassType {
  id: number
  classId: number
  className: string
}

const Student: React.FC = () => {
  const { selectedSession } = useAppSelector((state: RootState) => state.session);
  const sessionId = selectedSession?.sessionId ?? null;

  const dispatch = useDispatch()
  const theme = useTheme()
  const pathname = window.location.pathname
  const [loading, setLoading] = useState<boolean>(false)
  const [classes, setClasses] = useState<ClassType[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null)
  const [studentId, setStudentId] = useState("")
  const [searchStudentId, setSearchStudentId] = useState("")
  const [showTable, setShowTable] = useState(false)

  // Handlers
  const handleClassChange = (event: SelectChangeEvent<string>) => {
    const selectedClassObj =
      classes.find(cls => cls.className === event.target.value) || null
    setSelectedClass(selectedClassObj)
    setSearchStudentId("")
    setStudentId("")
    setShowTable(true)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setStudentId(value)
  }

  const handleSearch = () => {
    setSearchStudentId(studentId)
    setShowTable(true)
    setSelectedClass(null);
  }

  useEffect(() => {
    if (pathname === "/students") {
      dispatch(setPageTitle("Class Students Details"));
    } else {
      dispatch(setPageTitle("Class Student Attendance"));
    }

    const fetchClasses = async () => {
      setLoading(true)
      try {
        const response = await fetchAllClassesApi()
        if (response?.status !== 200) {
          if (response.status === 401) {
            dispatch(
              openModal({
                title: response?.statusText,
                bodyType: MODAL_CONSTANTS.SESSION_EXPIRED,
              }),
            )
          } else {
            dispatch(
              openModal({
                title: response?.statusText,
                bodyType: MODAL_CONSTANTS.ERROR,
              }),
            )
          }
        } else {
          setClasses(response?.data?.data || [])
        }
      } catch (error) {
        console.error("Error fetching classes", error)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [dispatch])

  return (
    <>
      <PageTitle />
      {/* Class Dropdown */}
      <Box sx={{ margin: "20px auto", maxWidth: "1200px" }}>
        {/* <h2>Select a Class</h2> */}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            gap: 2,
            marginTop: "20px",
          }}
        >
          {pathname === "/students" && (
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <TextField
                label="Enter Student ID"
                variant="outlined"
                value={studentId}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button onClick={handleSearch} variant="contained">
                        <SearchIcon />
                      </Button>
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1 }}
              />
            </Box>
          )}

          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel>Select Class</InputLabel>
            <Select
              value={selectedClass?.className || ""}
              onChange={handleClassChange}
              label="Select Class"
            >
              {classes.map(cls => (
                <MenuItem key={cls.id} value={cls.className}>
                  {cls.className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Conditionally show SessionFilter only when class is selected */}
          {
            selectedClass && pathname === "/students" &&
            <Box sx={{ flex: 1 }}>
              <SessionFilter />
            </Box>
          }
        </Box>



        {showTable && ( // Conditionally render based on showTable
          <Box sx={{ marginTop: "20px", width: "100%" }}>
            <StudentGrid
              classId={selectedClass ? String(selectedClass.classId) : ""}
              className={selectedClass ? selectedClass.className : ""}
              studentIdFilter={searchStudentId}
            />
          </Box>
        )}
      </Box>
    </>
  )
}

export default Student
