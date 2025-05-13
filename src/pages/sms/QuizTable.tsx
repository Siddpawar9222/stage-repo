import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import ScoreVisualization from "./ScoreVisualization";
import { jwtDecode } from 'jwt-decode';

const passCutoff = 75;

const QuizTable: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No token found');
        }

        const decodedToken: { sub: string } = jwtDecode(token);
        const email = decodedToken.sub;

        const studentResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dms/api/class-students/by-email/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(studentResponse.data.data);

        if (studentResponse.data.message !== 'SUCCESS' || !studentResponse.data.data) {
          throw new Error('Student not found or invalid response');
        }

        const studentId = studentResponse.data.data.studentId;

        const qms_url = import.meta.env.VITE_QMS_URL;
        const sms_url = import.meta.env.VITE_SMS_URL;

        const [qmsResponse, smsResponse] = await Promise.all([
          axios.get(`${qms_url}/qms/quiz/getAll`),
          axios.get(`${sms_url}/api/sms/student-quiz-marks/marks`, {
            params: { studentId },
          }),
        ]);

        const quizData = qmsResponse.data;
        const marksData = smsResponse.data;

        const quizzes = marksData.map((quiz: any) => {
          const matchingQuiz = quizData.find((q: any) => q.quizId === quiz.quizId);
          return {
            quizId: quiz.quizId,
            name: matchingQuiz?.quizName || "Unknown Quiz",
            fullMarks: matchingQuiz?.fullMarks || 0,
            marks: quiz.marks || 0,
          };
        });

        setQuizzes(quizzes);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap={3} p={3} width="100%" alignItems="center">
      <Box display="flex" width="100%" justifyContent="center" gap={3} flexWrap="wrap">
        <TableContainer component={Paper} sx={{ width: "50%", minWidth: 400, p: 2 }}>
          <Typography variant="h6" textAlign="center" sx={{ mt: 1, mb: 2, width: "100%" }}>
            Practice Test Results
          </Typography>
          {loading && (
            <Box textAlign="center" sx={{ mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {error && <Typography>Error: {error}</Typography>}
          {!loading && quizzes.length === 0 && !error && (
            <Typography textAlign="center">No Quiz Found</Typography>
          )}
          {!loading && quizzes.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Quiz Name</TableCell>
                  <TableCell align="center">Full Marks</TableCell>
                  <TableCell align="center">Marks</TableCell>
                  <TableCell align="center">%</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quizzes.map(quiz => {
                  const percentage = ((quiz.marks / quiz.fullMarks) * 100).toFixed(1);
                  const status = Number(percentage) >= passCutoff ? "Pass" : "Fail";

                  return (
                    <TableRow
                      key={quiz.quizId}
                      hover
                      onClick={() => setSelectedQuiz(quiz)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{quiz.name}</TableCell>
                      <TableCell align="center">{quiz.fullMarks}</TableCell>
                      <TableCell align="center">{quiz.marks}</TableCell>
                      <TableCell align="center">{percentage}%</TableCell>
                      <TableCell align="center" sx={{ color: status === "Pass" ? "green" : "red" }}>
                        {status}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <Box
          width="50%"
          minWidth={400}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}
        >
          {selectedQuiz ? (
            <ScoreVisualization
              correct={selectedQuiz.marks}
              incorrect={selectedQuiz.fullMarks - selectedQuiz.marks - (selectedQuiz.skipped || 0)}
              skipped={selectedQuiz.skipped || 0}
              total={selectedQuiz.fullMarks}
              timeSpent={selectedQuiz.timeSpent || 0}
              totalTime={selectedQuiz.totalTime || 3600} // Assume default 1-hour quiz
            />
          ) : (
            <Typography variant="h6" textAlign="center" sx={{ mt: 2 }}>
              Select a quiz to view details
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default QuizTable;