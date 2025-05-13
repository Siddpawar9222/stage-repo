import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  Switch,
  TableSortLabel,
} from "@mui/material"
import { Visibility, Edit, Delete, Add, Close, Save } from "@mui/icons-material"
import { openModal } from "../../../app/reducers/modalSlice"
import { MODAL_CONSTANTS } from "../../../utils/modalUtils"
import {
  deleteStudent,
  fetchAllStudentsPaginated,
  getStudentDetailsByStudentId,
} from "../../../services/apis/dms/studentService"
import { showNotification } from "../../../app/reducers/headerSlice"
import { useRole } from "../../../RoleContext"
import { roles } from "../../../utils/roles"
import {
  markBulkAttendance,
  getAttendance,
  updateAttendence,
  AttendanceRecord,
} from "../../../services/apis/ams/attendenceService"
import NotFound from "../../404"
import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { clearSelectedSession } from "../../../app/reducers/sessionSlice"

// Define TypeScript Interface
interface Student {
  id: number
  studentName: string
  email: string
  studentId: string
}

interface StudentGridProps {
  classId: string
  className: string
  studentIdFilter: string
}

type Order = "asc" | "desc"

const StudentGrid: React.FC<StudentGridProps> = ({
  classId,
  className,
  studentIdFilter,
}) => {
  const { selectedSession } = useAppSelector((state: RootState) => state.session);
  const sessionId = selectedSession?.sessionId ?? null;

  const dispatch = useDispatch()
  const theme = useTheme()
  const { userRole } = useRole()
  const [loading, setLoading] = useState<boolean>(false)
  const [students, setStudents] = useState<Student[]>([])
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalElements, setTotalElements] = useState<number>(0)
  const pathname = window.location.pathname
  const [attendanceStates, setAttendanceStates] = useState<{
    [studentId: string]: boolean
  }>({})
  const [attendanceLocked, setAttendanceLocked] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>("studentName")
  const [direction, setDirection] = useState<Order>("asc")
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [editMode, setEditMode] = useState<{ [studentId: string]: boolean }>({})
  const [apiError, setApiError] = useState<boolean>(false)

  const fetchStudentsByClassId = async (
    pageNumber: number | undefined,
    pageSize: number | undefined,
    classId: string | undefined,
    sortBy: string | undefined = "studentName",
    direction: Order | undefined = "asc"
  ) => {
    setLoading(true)
    const response = await fetchAllStudentsPaginated(
      classId,
      pageNumber,
      pageSize,
      sortBy,
      direction,
      sessionId,
    )
    if (response?.status === 404) {
      setApiError(true)
    } else if (response?.status !== 200) {
      dispatch(
        openModal({
          title: response?.statusText,
          bodyType: MODAL_CONSTANTS.ERROR,
        }),
      )
    } else {
      setStudents(response?.data?.data?.content || [])
      setTotalElements(response?.data?.data?.totalElements || 0)
      setApiError(false)
    }
    setLoading(false)
  }

  const fetchStudentByStudentId = async (studentId: string | undefined) => {
    setLoading(true)
    const response = await getStudentDetailsByStudentId(studentId)
    if (response?.status === 404) {
      setApiError(true)
    } else if (response?.status !== 200) {
      dispatch(
        openModal({
          title: response?.statusText,
          bodyType: MODAL_CONSTANTS.ERROR,
        }),
      )
    } else {
      setStudents(response?.data?.data ? [response?.data?.data] : [])
      setTotalElements(response?.data?.data?.content ? 1 : 0)
      setApiError(false)
    }
    setLoading(false)
  }

  const deleteStudentById = async (id: any) => {
    setLoading(true)
    const response = await deleteStudent(id)
    if (response?.status !== 200) {
      dispatch(
        openModal({
          title: response?.statusText,
          bodyType: MODAL_CONSTANTS.ERROR,
        }),
      )
    } else {
      dispatch(
        showNotification({
          message: "Student deleted successfully!",
          status: 1,
        }),
      )
      fetchStudentsByClassId(pageNumber, pageSize, classId, sortBy, direction)
    }
    setLoading(false)
  }

  const handlePageNumber = (event: unknown, newPage: number) => {
    setPageNumber(newPage)
  }

  const fetchAttendance = async () => {
    if (classId && pathname === "/attendence") {
      setLoading(true)
      const today = new Date().toISOString().split("T")[0]
      try {
        const fetchedAttendance = await getAttendance(classId, today)
        setAttendanceData(fetchedAttendance)
        const initialAttendanceStates: { [studentId: string]: boolean } = {}
        let isLocked = false

        fetchedAttendance.forEach(
          (record: {
            studentId: string | number
            attendenceStatus: string
            actionState: string
          }) => {
            initialAttendanceStates[record.studentId] =
              record.attendenceStatus === "PRESENT"
            if (record.actionState === "LOCKED") {
              isLocked = true
            }
          },
        )
        setAttendanceStates(initialAttendanceStates)
        setAttendanceLocked(isLocked)
      } catch (error) {
        console.error("Error fetching attendance:", error)
        setAttendanceData([])
        setAttendanceLocked(false)
      } finally {
        setLoading(false)
      }
    } else {
      setAttendanceData([])
      setAttendanceLocked(false)
    }
  }

  const handlePageSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10))
    setPageNumber(0)
  }

  const handleAddStudent = () => {
    dispatch(
      openModal({
        title: "Add Student",
        bodyType: MODAL_CONSTANTS.ADD_STUDENT,
        extraObject: {
          isAdd: MODAL_CONSTANTS.ADD_STUDENT,
          classId,
          onSuccess: () => {
            if (sortBy === "id" && direction === "desc") {
              fetchStudentsByClassId(
                pageNumber,
                pageSize,
                classId,
                "id",
                "desc"
              )
            } else {
              setSortBy("id")
              setDirection("desc")
            }
          },
        },
      }),
    )
  }

  const handleEditStudent = (index: number) => {
    const editedStudentObj = students[index]
    dispatch(
      openModal({
        title: "Edit Student",
        bodyType: MODAL_CONSTANTS.EDIT_STUDENT,
        extraObject: {
          studentId: editedStudentObj?.studentId,
          classId,
          onSuccess: () =>
            fetchStudentsByClassId(
              pageNumber,
              pageSize,
              classId,
              sortBy,
              direction,
            ),
        },
      }),
    )
  }

  const handleViewStudent = (index: number) => {
    const studentObj = students[index]
    dispatch(
      openModal({
        title: "View Student",
        bodyType: MODAL_CONSTANTS.VIEW_STUDENT_DETAILS,
        extraObject: {
          studentId: studentObj?.studentId,
        },
      }),
    )
  }

  const handleDeleteStudent = (index: number) => {
    const id = students[index].id
    dispatch(
      openModal({
        bodyType: MODAL_CONSTANTS.DELETE_CONFIRMATION,
        extraObject: {
          handleDelete: () => deleteStudentById(id),
        },
      }),
    )
  }

  const handleToggle = (studentId: string, isChecked: boolean) => {
    setAttendanceStates({ ...attendanceStates, [studentId]: isChecked })
  }

  const handleLockAttendance = async () => {
    setLoading(true)
    const today = new Date().toISOString().split("T")[0]
    const attendanceRecords: {
      classId: string
      studentId: string
      date: string
      attendenceStatus: "PRESENT" | "ABSENT" // Corrected type
      actionState: "LOCKED" // Corrected type
    }[] = students.map(student => ({
      classId,
      studentId: student.studentId,
      date: today,
      attendenceStatus: attendanceStates[student.studentId]
        ? "PRESENT"
        : "ABSENT",
      actionState: "LOCKED",
    }))

    try {
      await markBulkAttendance(attendanceRecords)
      setAttendanceLocked(true)
      dispatch(
        showNotification({
          message: "Attendance locked successfully!",
          status: 1,
        }),
      )
    } catch (error) {
      dispatch(
        openModal({
          title: "Error Locking Attendance",
          bodyType: MODAL_CONSTANTS.ERROR,
        }),
      )
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAttendance = async () => {
    setLoading(true)
    const today = new Date().toISOString().split("T")[0]
    const updatedRecords: AttendanceRecord[] = students.map(student => ({
      classId,
      studentId: student.studentId,
      date: today,
      attendenceStatus: attendanceStates[student.studentId]
        ? "PRESENT"
        : "ABSENT",
      actionState: "NOT_MARKED", // Or LOCKED, based on your API requirements
    }))

    try {
      await updateAttendence(updatedRecords)
      dispatch(
        showNotification({
          message: "Attendance updated successfully!",
          status: 1,
        }),
      )
      // Refresh attendance data
      const fetchedAttendance = await getAttendance(classId, today)
      setAttendanceData(fetchedAttendance)
      const initialAttendanceStates: { [studentId: string]: boolean } = {}
      let isLocked = false

      fetchedAttendance.forEach(record => {
        initialAttendanceStates[record.studentId] =
          record.attendenceStatus === "PRESENT"
        if (record.actionState === "LOCKED") {
          isLocked = true
        }
      })

      setAttendanceStates(initialAttendanceStates)
      setAttendanceLocked(isLocked)
      setAttendanceLocked(true)
      setEditMode({}) // Reset edit mode
    } catch (error) {
      dispatch(
        openModal({
          title: "Error updating attendance",
          bodyType: MODAL_CONSTANTS.ERROR,
        }),
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (column: string) => {
    setDirection(prev => (sortBy === column && prev === "asc" ? "desc" : "asc"))
    setSortBy(column)
  }

  useEffect(() => {
    if (studentIdFilter) {
      // If studentIdFilter is present, fetch by student ID
      fetchStudentByStudentId(studentIdFilter);
    } else if (!studentIdFilter && classId) {
      // If studentIdFilter is not present and classId is available, fetch by class ID
      fetchStudentsByClassId(pageNumber, pageSize, classId, sortBy, direction);
    } else if (!classId) {
      // If no studentIdFilter and no classId, reset the student list
      setStudents([]);
      setTotalElements(0);
    }
  }, [dispatch, studentIdFilter, classId, pageNumber, pageSize, sortBy, direction, selectedSession]);


  useEffect(() => {
    fetchAttendance()
  }, [classId, pathname])

  useEffect(() => {
    return () => {
      dispatch(clearSelectedSession());
    }
  }, [])

  const handleEditAttendanceClick = () => {
    setEditMode(
      students.reduce(
        (acc, student) => ({ ...acc, [student.studentId]: true }),
        {},
      ),
    )
    setAttendanceLocked(false)
  }

  if (apiError) {
    return <NotFound />
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        p={2}
        sx={{
          background: theme.palette.background.paper,
          boxShadow: "0 4px #333",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {`${className.toUpperCase()} Students`}
        </Typography>

        {userRole && // Null check for userRole
          (userRole === roles.admin[0] ||
            roles.operator.includes(userRole)) && (
            <>
              {pathname === "/students" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddStudent}
                  disabled={loading || !selectedSession?.isActive}
                  sx={{ marginRight: "8px" }}
                >
                  <Add />
                  Add Student
                </Button>
              )}
              {pathname === "/attendence" && userRole === roles.admin[0] && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditAttendanceClick}
                >
                  Edit Attendance
                </Button>
              )}
            </>
          )}
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="students table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  <TableSortLabel
                    active={sortBy === "id"}
                    direction={sortBy === "id" ? direction : "asc"}
                    onClick={() => handleSort("id")}
                  >
                    Student Id
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  <TableSortLabel
                    active={sortBy === "studentName"}
                    direction={sortBy === "studentName" ? direction : undefined}
                    onClick={() => handleSort("studentName")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                {pathname === "/students" && (
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <TableSortLabel
                      active={sortBy === "email"}
                      direction={sortBy === "email" ? direction : undefined}
                      onClick={() => handleSort("email")}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                )}
                {pathname === "/students" ? (
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                ) : pathname === "/attendence" ? (
                  <TableCell sx={{ fontWeight: "bold" }}>Attendance</TableCell>
                ) : (
                  <TableCell></TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {students?.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {student.studentName}
                  </TableCell>
                  {pathname === "/students" && (
                    <TableCell>{student.email}</TableCell>
                  )}
                  {pathname === "/students" ? (
                    <TableCell>
                      <IconButton
                        onClick={() => handleViewStudent(index)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => handleEditStudent(index)}>
                        <Edit
                          sx={{
                            color: "yellow",
                          }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteStudent(index)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  ) : pathname === "/attendence" ? (
                    <TableCell>
                      {editMode[student.studentId] ? (
                        <Switch
                          checked={attendanceStates[student.studentId] || false}
                          onChange={event =>
                            handleToggle(
                              student.studentId,
                              event.target.checked,
                            )
                          }
                          disabled={attendanceLocked}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "green", // Color of the switch when checked
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "green", // Color of the track when checked
                            },
                          }}
                        />
                      ) : (
                        <Switch
                          checked={attendanceStates[student.studentId] || false}
                          onChange={event =>
                            handleToggle(
                              student.studentId,
                              event.target.checked,
                            )
                          }
                          disabled={attendanceLocked}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "green",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "green",
                            },
                          }}
                        />
                      )}
                    </TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={totalElements}
            rowsPerPage={pageSize}
            page={pageNumber}
            onPageChange={handlePageNumber}
            onRowsPerPageChange={handlePageSize}
          />
        </TableContainer>
      </Paper>

      {pathname === "/attendence" && userRole === roles.teacher[0] && (
        <Box mt={2} display="flex" justifyContent="flex-start">
          <Button
            variant="contained"
            color="primary"
            onClick={handleLockAttendance}
            disabled={attendanceLocked}
          >
            {attendanceLocked ? "Attendance Locked" : "Lock Attendance"}
          </Button>
        </Box>
      )}
      {pathname === "/attendence" &&
        userRole === roles.admin[0] &&
        editMode &&
        Object.keys(editMode).length > 0 && (
          <Box mt={2} display="flex" justifyContent="flex-start">
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateAttendance}
              sx={{ marginRight: "8px" }}
            >
              Update Attendance
            </Button>
          </Box>
        )}
    </>
  )
}

export default StudentGrid
