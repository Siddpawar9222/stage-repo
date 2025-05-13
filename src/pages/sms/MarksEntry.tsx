import type React from "react"
import { useEffect, useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import {
  Box,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material"
import { openModal, setPageTitle } from "../../app/reducers/modalSlice"
import { fetchAllClassesApi } from "../../services/apis/dms/studentService"
import { getQuizByClassId } from "../../services/apis/qms/QuizService"
import { getAllStudentsByClassId } from "../../services/apis/dms/studentService"
import { MODAL_CONSTANTS } from "../../utils/modalUtils"
import { saveStudentMarks } from "../../services/apis/sms/QuizMarkService"
import PageTitle from "../../components/PageTitle"

interface ClassType {
  id: number
  classId: number
  className: string
}

interface QuizType {
  quizId: number
  quizName: string
}

interface StudentType {
  studentId: number
  studentName: string
  marks: number | null
}

const MarksEntry: React.FC = () => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false) // New state for saving marks
  const [classes, setClasses] = useState<ClassType[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null)
  const [quizzes, setQuizzes] = useState<QuizType[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null)
  const [students, setStudents] = useState<StudentType[]>([])

  useEffect(() => {
    dispatch(setPageTitle("Marks Entry"))

    const fetchClasses = async () => {
      setLoading(true)
      try {
        const response = await fetchAllClassesApi()
        if (response?.status === 200) {
          setClasses(response?.data?.data || [])
        } else {
          dispatch(
            openModal({
              title: response?.statusText || "Error fetching classes",
              bodyType: MODAL_CONSTANTS.ERROR,
            }),
          )
        }
      } catch (error) {
        console.error("Error fetching classes", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [dispatch])

  const handleClassChange = async (event: any) => {
    const selectedId = event.target.value
    const selectedClassObj =
      classes.find(cls => cls.classId === selectedId) || null
    setSelectedClass(selectedClassObj)
    setSelectedQuiz(null)
    setQuizzes([])
    setStudents([])
    if (selectedClassObj) {
      setLoading(true)
      try {
        const quizzesData = await getQuizByClassId(selectedClassObj.classId)
        setQuizzes(quizzesData)
      } catch (error) {
        console.error("Error fetching quizzes", error)
        dispatch(
          openModal({
            title: "Error fetching quizzes",
            bodyType: MODAL_CONSTANTS.ERROR,
          }),
        )
      } finally {
        setLoading(false)
      }
    }
  }

  const handleQuizChange = async (event: any) => {
    const selectedId = event.target.value
    const selected = quizzes.find(qz => qz.quizId === selectedId) || null
    setSelectedQuiz(selected)
    if (selectedClass && selected) {
      setLoading(true)
      try {
        const studentsData = await getAllStudentsByClassId(
          selectedClass.classId,
        )
        setStudents(
          studentsData.data.data.map((student: any) => ({
            studentId: student.studentId,
            studentName: student.studentName,
            marks: null,
          })),
        )
      } catch (error) {
        console.error("Error fetching students", error)
        dispatch(
          openModal({
            title: "Error fetching students",
            bodyType: MODAL_CONSTANTS.ERROR,
          }),
        )
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSaveMarks = async () => {
    if (!selectedQuiz) {
      dispatch(
        openModal({
          title: "Error",
          bodyType: MODAL_CONSTANTS.ERROR,
          extraObject: { message: "Please select a quiz before saving marks." },
        })
      );
      return;
    }

    setSaving(true);
    try {
      const marksData = {
        quizId: selectedQuiz.quizId,
        studentMarks: students.map(student => ({
          studentId: String(student.studentId), // Convert studentId to string
          mark: student.marks || 0,
        })),
      };
      await saveStudentMarks(marksData);
      dispatch(
        openModal({
          title: "Marks saved successfully",
        })
      );
      setSelectedClass(null);
      setSelectedQuiz(null);
      setStudents([]);
      setQuizzes([]);
    } catch (error) {
      console.error("Error saving marks", error);
      dispatch(
        openModal({
          title: "Error saving marks",
          bodyType: MODAL_CONSTANTS.ERROR,
        })
      );
    } finally {
      setSaving(false);
    }
  };

  const handleMarksChange = (studentId: number, value: string) => {
    const updatedStudents = students.map(student =>
      student.studentId === studentId
        ? { ...student, marks: parseInt(value, 10) || null }
        : student
    );
    setStudents(updatedStudents);
  };


  const isFormComplete =
    students.length > 0 &&
    students.every(
      student => student.marks !== null && student.marks !== undefined,
    )

  return (
    <>
      <PageTitle />
      <Box sx={{ margin: "20px auto", maxWidth: "1200px" }}>
        {loading && (
          <Box textAlign="center" sx={{ mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {!loading && (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Class</InputLabel>
              <Select
                value={selectedClass?.classId || ""}
                onChange={handleClassChange}
                label="Select Class"
              >
                {classes.map(cls => (
                  <MenuItem key={cls.classId} value={cls.classId}>
                    {cls.className}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {quizzes.length > 0 && (
              <FormControl fullWidth sx={{ mt: 4 }}>
                <InputLabel>Select Quiz</InputLabel>
                <Select
                  value={selectedQuiz?.quizId || ""}
                  onChange={handleQuizChange}
                  label="Select Quiz"
                >
                  {quizzes.map(quiz => (
                    <MenuItem key={quiz.quizId} value={quiz.quizId}>
                      {quiz.quizName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {selectedClass && quizzes.length === 0 && (
              <Box sx={{ marginTop: "20px", textAlign: "center" }}>
                <Typography variant="h6" color="textSecondary">
                  No quizzes exist for the selected class.
                </Typography>
              </Box>
            )}

            {students.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student ID</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Marks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map(student => (
                      <TableRow key={student.studentId}>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.studentName}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={student.marks ?? ""}
                            inputProps={{ min: 0 }}
                            onChange={e =>
                              handleMarksChange(
                                student.studentId,
                                e.target.value,
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {students.length > 0 && (
              <Box textAlign="center" sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveMarks}
                  disabled={!isFormComplete || saving} // Disable while saving
                >
                  {saving ? <CircularProgress size={24} /> : "Save Marks"}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  )
}

export default MarksEntry
