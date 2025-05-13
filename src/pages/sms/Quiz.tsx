import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
} from "@mui/material"

import { MODAL_CONSTANTS } from "../../utils/modalUtils"
import { openModal, setPageTitle } from "../../app/reducers/modalSlice"
import { fetchAllClassesApi } from "../../services/apis/dms/studentService"
import PageTitle from "../../components/PageTitle"
import QuizGrid from "./QuizGrid"
import { getQuizByClassId } from "../../services/apis/qms/QuizService"
import type { SelectChangeEvent } from "@mui/material";


interface ClassType {
  id: number
  classId: number
  className: string
}

const Quiz: React.FC = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [classes, setClasses] = useState<ClassType[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null)
  const [quizId, setQuizId] = useState<number | null>(null)

  const handleClassChange = async (event: SelectChangeEvent<string>, _: React.ReactNode) => {
    const selectedClassObj = classes.find((cls) => cls.className === event.target.value) || null;
    setSelectedClass(selectedClassObj);

    if (selectedClassObj) {
      try {
        const quizData = await getQuizByClassId(selectedClassObj.classId);
        setQuizId(quizData?.quizId || null);
      } catch (error) {
        console.error("Error fetching quizId:", error);
        dispatch(
          openModal({
            title: "Error",
            bodyType: MODAL_CONSTANTS.ERROR,
            extraObject: { message: "Failed to fetch quizId for the selected class." },
          })
        );
      }
    } else {
      setQuizId(null);
    }
  };
  useEffect(() => {
    dispatch(setPageTitle("Class Quiz Details"))

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

  return (
    <>
      <PageTitle />
      <Box sx={{ margin: "20px auto", maxWidth: "1200px" }}>
        <h2>Select a Class</h2>
        <FormControl fullWidth>
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

        {/* Student Grid */}
        {selectedClass && quizId !== null && (
          <Box sx={{ marginTop: "20px" }}>
            <QuizGrid
              classId={String(selectedClass.classId)}
              className={selectedClass.className}
              quizId={quizId} // Pass quizId to QuizGrid
            />
          </Box>
        )}
      </Box>
    </>
  )
}

export default Quiz
