import React, { useEffect, useState } from "react";
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
    useTheme,
    TableSortLabel,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
  } from "@mui/material";
  import { Edit } from "@mui/icons-material";
  import { useAppDispatch } from "../../app/hooks";
  import { openModal } from "../../app/reducers/modalSlice";
  import { MODAL_CONSTANTS } from "../../utils/modalUtils";
  import { fetchAllStudentsPaginated } from "../../services/apis/dms/studentService";
  import { getStudentMarksByQuizId, updateStudentMarks } from "../../services/apis/sms/QuizMarkService";

  type Order = "asc" | "desc";

  interface Student {
    id: number;
    studentName: string;
    studentId: string;
    marks: number | string;
  }

  interface StudentGridProps {
    classId: string;
    className: string;
    quizId: number;
  }

  const QuizGrid: React.FC<StudentGridProps> = ({ classId, className, quizId }) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const [loading, setLoading] = useState<boolean>(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>("studentName");
    const [direction, setDirection] = useState<Order>("asc");

    // State for updating marks
    const [openMarksDialog, setOpenMarksDialog] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [newMarks, setNewMarks] = useState<string>("");

    const fetchStudentsByClassId = async (
      pageNumber: number,
      pageSize: number,
      classId: string,
      quizId: number,
      sortBy: string = "studentName",
      direction: Order = "asc"
    ) => {
      setLoading(true);
      try {
        const response = await fetchAllStudentsPaginated(classId, pageNumber, pageSize, sortBy, direction,null);
        if (response?.status !== 200) {
          dispatch(openModal({ title: response?.statusText, bodyType: MODAL_CONSTANTS.ERROR }));
        } else {
          const studentsData = response?.data?.data?.content || [];
          const marksData = await getStudentMarksByQuizId(quizId);

          const studentsWithMarks = studentsData.map((student: Student) => ({
            ...student,
            marks: marksData.find((mark: any) => mark.studentId === student.studentId)?.marks || "Marks not saved",
          }));
          setStudents(studentsWithMarks);
          setTotalElements(response?.data?.data?.totalElements || 0);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleUpdateMarks = (index: number) => {
      const student = students[index];
      setSelectedStudent(student);
      setNewMarks(""); // Reset marks input
      setOpenMarksDialog(true);
    };

    const handleCloseMarksDialog = () => {
      setOpenMarksDialog(false);
      setSelectedStudent(null);
      setNewMarks("");
    };

    const handleSaveMarks = async () => {
      if (!selectedStudent || isNaN(parseInt(newMarks, 10))) {
        dispatch(
          openModal({
            title: "Invalid Input",
            bodyType: MODAL_CONSTANTS.ERROR,
            extraObject: { message: "Please enter a valid number for marks." },
          })
        );
        return;
      }

      try {
        setLoading(true);

        const marksData = {
          quizId,
          studentMarks: [
            {
              studentId: selectedStudent.studentId,
              mark: parseInt(newMarks, 10),
            },
          ],
        };

        await updateStudentMarks(marksData);

        dispatch(
          openModal({
            title: "Success",
            extraObject: { message: "Marks updated successfully!" },
          })
        );

        fetchStudentsByClassId(pageNumber, pageSize, classId, quizId, sortBy, direction);
      } catch (error: any) {
        console.error("Error updating marks:", error.message);
        dispatch(
          openModal({
            title: "Error",
            bodyType: MODAL_CONSTANTS.ERROR,
            extraObject: { message: error.message },
          })
        );
      } finally {
        setLoading(false);
        handleCloseMarksDialog();
      }
    };

    useEffect(() => {
      fetchStudentsByClassId(pageNumber, pageSize, classId, quizId, sortBy, direction);
    }, [classId, quizId, pageNumber, pageSize, sortBy, direction]);

    return (
      <>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} p={2} sx={{ background: theme.palette.background.paper }}>
          <Typography variant="h6" fontWeight="bold">{`${className.toUpperCase()} Students`}</Typography>
        </Box>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          {loading ? (
            <Box textAlign="center" sx={{ mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table stickyHeader aria-label="students table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Student Id</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Marks</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students?.map((student, index) => (
                    <TableRow key={student.studentId}>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>{student.studentName}</TableCell>
                      <TableCell>{student.marks}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleUpdateMarks(index)} color="secondary">
                          <Edit />
                        </IconButton>
                      </TableCell>
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
                onPageChange={(event, newPage) => setPageNumber(newPage)}
                onRowsPerPageChange={(event) => {
                  setPageSize(parseInt(event.target.value, 10));
                  setPageNumber(0);
                }}
              />
            </TableContainer>
          )}
        </Paper>

        {/* Marks Update Dialog */}
        <Dialog open={openMarksDialog} onClose={handleCloseMarksDialog}>
          <DialogTitle>Update Marks</DialogTitle>
          <DialogContent>
            <Typography>Student: {selectedStudent?.studentName}</Typography>
            <TextField
              label="New Marks"
              type="number"
              fullWidth
              value={newMarks}
              onChange={(e) => setNewMarks(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMarksDialog} color="secondary">Cancel</Button>
            <Button onClick={handleSaveMarks} color="primary" disabled={loading}>Save</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  export default QuizGrid;