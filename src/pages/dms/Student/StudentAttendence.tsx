import React, { useState, useEffect, useMemo } from "react"
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import "dayjs/locale/en-in"
import localizedFormat from "dayjs/plugin/localizedFormat"
import {
  getWeeklyAttendence,
  getMonthlyAttendence,
  getCustomAttendence,
  AttendanceRecord,
} from "../../../services/apis/ams/attendenceService"
import { fetchStudentByEmail } from "../../../services/apis/dms/studentService"
import { useDispatch } from "react-redux"
import PageTitle from "../../../components/PageTitle"
import { setPageTitle } from "../../../app/reducers/modalSlice"

dayjs.extend(localizedFormat)
dayjs.locale("en-in")

interface AttendanceData {
  weekly: AttendanceRecord[]
  monthly: AttendanceRecord[]
  custom: AttendanceRecord[]
}

const StudentAttendance: React.FC<{ studentId: string }> = ({ studentId }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("sm"))
  const [view, setView] = useState<"weekly" | "monthly" | "custom">("weekly")
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({
    weekly: [],
    monthly: [],
    custom: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null)
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null)
  const [localStudentId, setLocalStudentId] = useState<string | null>(
    localStorage.getItem("studentId"),
  )
  const [isFetchingStudent, setIsFetchingStudent] = useState(false)

  useEffect(() => {
    const fetchStudentId = async () => {
      if (!localStudentId) {
        setIsFetchingStudent(true)
        try {
          const student = await fetchStudentByEmail()
          if (student?.studentId) {
            localStorage.setItem("studentId", student.studentId)
            setLocalStudentId(student.studentId)
          } else {
            setError("Failed to retrieve student ID.")
          }
        } catch (error: any) {
          setError("Failed to fetch student information.")
          console.error(error)
        } finally {
          setIsFetchingStudent(false)
        }
      }
    }

    fetchStudentId()
  }, [localStudentId])

  useEffect(() => {
    dispatch(setPageTitle("Student Attendance for "))

    const fetchInitialAttendance = async () => {
      if (localStudentId) {
        setLoading(true)
        setError(null)
        try {
          const weeklyData = await getWeeklyAttendence(localStudentId)
          const monthlyData = await getMonthlyAttendence(localStudentId)
          setAttendanceData({
            weekly: weeklyData,
            monthly: monthlyData,
            custom: [],
          })
        } catch (err: any) {
          setError("Failed to fetch initial attendance data.")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchInitialAttendance()
  }, [localStudentId])

  const handleViewChange = (newView: "weekly" | "monthly" | "custom") => {
    setView(newView)
    if (newView === "custom" && startDate && endDate && localStudentId) {
      fetchCustomAttendance(startDate, endDate, localStudentId)
    }
  }

  const fetchCustomAttendance = async (
    start: dayjs.Dayjs,
    end: dayjs.Dayjs,
    studentId: string,
  ) => {
    setLoading(true)
    setError(null)
    try {
      const formattedStartDate = start.format("YYYY-MM-DD")
      const formattedEndDate = end.format("YYYY-MM-DD")
      const customData = await getCustomAttendence(
        studentId,
        formattedStartDate,
        formattedEndDate,
      )
      setAttendanceData(prevData => ({ ...prevData, custom: customData }))
    } catch (err: any) {
      setError("Failed to fetch custom attendance data.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string): string => {
    return dayjs(dateString).format("DD MMM YYYY")
  }

  const sortedWeeklyAttendance = useMemo(() => {
    return [...attendanceData.weekly].sort(
      (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
    )
  }, [attendanceData.weekly])

  const sortedMonthlyAttendance = useMemo(() => {
    return [...attendanceData.monthly].sort(
      (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
    )
  }, [attendanceData.monthly])

  const sortedCustomAttendance = useMemo(() => {
    return [...attendanceData.custom].sort(
      (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
    )
  }, [attendanceData.custom])

  const weeklyAttendanceCount = useMemo(() => {
    const presentCount = sortedWeeklyAttendance.filter(
      record => record.attendenceStatus.toLowerCase() === "present",
    ).length
    return { present: presentCount, total: sortedWeeklyAttendance.length }
  }, [sortedWeeklyAttendance])

  const monthlyAttendanceCount = useMemo(() => {
    const presentCount = sortedMonthlyAttendance.filter(
      record => record.attendenceStatus.toLowerCase() === "present",
    ).length
    return { present: presentCount, total: sortedMonthlyAttendance.length }
  }, [sortedMonthlyAttendance])

  const customAttendanceCount = useMemo(() => {
    const presentCount = sortedCustomAttendance.filter(
      record => record.attendenceStatus.toLowerCase() === "present",
    ).length
    return { present: presentCount, total: sortedCustomAttendance.length }
  }, [sortedCustomAttendance])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return theme.palette.success.dark
      case "absent":
        return theme.palette.error.dark
      default:
        return ""
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <PageTitle/> */}
      <Box sx={{ maxWidth: 800, margin: "0 auto", paddingBottom: "30px" }}>
        <Typography variant="h4" gutterBottom>
          Student Attendance
        </Typography>

        {isFetchingStudent && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Typography>Fetching Student Information...</Typography>
            <CircularProgress sx={{ ml: 2 }} />
          </Box>
        )}

        {loading &&
          !isFetchingStudent &&
          !attendanceData.weekly.length &&
          !attendanceData.monthly.length && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {localStudentId ? (
          <>
            <Box sx={{ marginBottom: 2 }}>
              <Button
                variant={view === "weekly" ? "contained" : "outlined"}
                onClick={() => handleViewChange("weekly")}
                sx={{ mr: 1 }}
              >
                Weekly
              </Button>
              <Button
                variant={view === "monthly" ? "contained" : "outlined"}
                onClick={() => handleViewChange("monthly")}
                sx={{ mr: 1 }}
              >
                Monthly
              </Button>
              <Button
                variant={view === "custom" ? "contained" : "outlined"}
                onClick={() => handleViewChange("custom")}
                sx={{ mt: isSmallScreen ? 2 : 0 }}
              >
                Custom Range
              </Button>
            </Box>

            {view === "weekly" && sortedWeeklyAttendance.length > 0 && (
              <>
                <Typography variant="subtitle1">
                  Weekly Attendance: {weeklyAttendanceCount.present} out of{" "}
                  {weeklyAttendanceCount.total}
                </Typography>

                <Paper sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ p: 2 }}>
                    Weekly Attendance
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedWeeklyAttendance.map(record => (
                          <TableRow key={record.date}>
                            <TableCell>{formatDate(record.date)}</TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                color: getStatusColor(record.attendenceStatus),
                              }}
                            >
                              {record.attendenceStatus}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </>
            )}

            {view === "monthly" && sortedMonthlyAttendance.length > 0 && (
              <>
              <Typography variant="subtitle1">
                  Monthly Attendance: {monthlyAttendanceCount.present} out of{" "}
                  {monthlyAttendanceCount.total}
                </Typography>
              <Paper sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ p: 2 }}>
                  Monthly Attendance
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedMonthlyAttendance.map(record => (
                        <TableRow key={record.date}>
                          <TableCell>{formatDate(record.date)}</TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: getStatusColor(record.attendenceStatus),
                            }}
                          >
                            {record.attendenceStatus}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              </>
            )}

            {view === "custom" && (
              <Box
                sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Typography variant="h6">Custom Attendance Range</Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    flexDirection: isSmallScreen ? "column" : "row",
                  }}
                >
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={newValue => setStartDate(newValue)}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={newValue => setEndDate(newValue)}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (startDate && endDate && localStudentId) {
                        fetchCustomAttendance(
                          startDate,
                          endDate,
                          localStudentId,
                        )
                      }
                    }}
                    disabled={!startDate || !endDate}
                    sx={{ width: isSmallScreen ? "100%" : "auto" }}
                  >
                    Go
                  </Button>
                </Box>
                {sortedCustomAttendance.length > 0 && (
                  <>
                  <Typography variant="subtitle1">
                  Custom Attendance: {customAttendanceCount.present} out of{" "}
                  {customAttendanceCount.total}
                </Typography>
                  <Paper sx={{ mt: 2 }}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sortedCustomAttendance.map(record => (
                            <TableRow key={record.date}>
                              <TableCell>{formatDate(record.date)}</TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  color: getStatusColor(
                                    record.attendenceStatus,
                                  ),
                                }}
                              >
                                {record.attendenceStatus}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </>
                )}
              </Box>
            )}
          </>
        ) : (
          !isFetchingStudent && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Student ID not found. Please ensure you are logged in as a
              student.
            </Alert>
          )
        )}
      </Box>
    </LocalizationProvider>
  )
}

export default StudentAttendance
