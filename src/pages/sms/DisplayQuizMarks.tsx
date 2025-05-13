import { ChangeEvent, useEffect, useState } from "react";
import type React from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  Box,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { openModal, setPageTitle } from "../../app/reducers/modalSlice";
import { fetchAllClassesApi } from "../../services/apis/dms/studentService";
import { MODAL_CONSTANTS } from "../../utils/modalUtils";
import QuizGrid from "./QuizGrid";
import PageTitle from "../../components/PageTitle";
import type { SelectChangeEvent } from "@mui/material";
import { getQuizByClassId } from "../../services/apis/qms/QuizService";

interface ClassType {
  id: number;
  classId: number;
  className: string;
}

interface QuizType {
  quizId: number;
  quizName: string;
  marks: number;
}

const DisplayQuizMarks: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);

  useEffect(() => {
    dispatch(setPageTitle("Display Quiz Marks"));

    const fetchClasses = async () => {
      setLoading(true);
      try {
        const response = await fetchAllClassesApi();
        if (response?.status === 200) {
          setClasses(response?.data?.data || []);
        } else {
          dispatch(
            openModal({
              title: response?.statusText || "Error fetching classes",
              bodyType: MODAL_CONSTANTS.ERROR,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching classes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [dispatch]);

  const handleClassChange = async (event: SelectChangeEvent<string>) => {
    const selectedClassObj =
      classes.find((cls) => cls.className === event.target.value) || null;
    setSelectedClass(selectedClassObj);
    setSelectedQuiz(null); // Reset quiz when class changes
    setQuizzes([]); // Clear quizzes when class changes
    if (selectedClassObj) {
      try {
        const quizzesData = await getQuizByClassId(selectedClassObj.classId);
        setQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching quizzes", error);
        dispatch(
          openModal({
            title: "Error fetching quizzes",
            bodyType: MODAL_CONSTANTS.ERROR,
          })
        );
      }
    }
  };

  const handleQuizChange = (event: SelectChangeEvent<string>) => {
    const selected =
      quizzes.find((qz) => qz.quizName === event.target.value) || null;
    setSelectedQuiz(selected);
  };

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
                value={selectedClass?.className || ""}
                onChange={handleClassChange}
                label="Select Class"
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.classId} value={cls.className}>
                    {cls.className}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedClass && quizzes.length === 0 && (
              <Box sx={{ marginTop: "20px", textAlign: "center" }}>
                <Typography variant="h6" color="textSecondary">
                  No quizzes exist for the selected class.
                </Typography>
              </Box>
            )}

            {quizzes.length > 0 && (
              <FormControl fullWidth sx={{ mt: 4 }}>
                <InputLabel>Select Quiz</InputLabel>
                <Select
                  value={selectedQuiz?.quizName || ""}
                  onChange={handleQuizChange}
                  label="Select Quiz"
                >
                  {quizzes.map((quiz) => (
                    <MenuItem key={quiz.quizId} value={quiz.quizName}>
                      {quiz.quizName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {selectedQuiz && (
              <Box sx={{ marginTop: "20px" }}>
                <Typography variant="h6">Selected Quiz Marks</Typography>
                <Typography>Quiz Name: {selectedQuiz.quizName}</Typography>
              </Box>
            )}

            {selectedClass && selectedQuiz && (
              <Box sx={{ marginTop: "20px" }}>
                <QuizGrid
                  classId={String(selectedClass.classId)}
                  className={selectedClass.className}
                  quizId={selectedQuiz?.quizId} // Pass quizId as a prop
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default DisplayQuizMarks;
