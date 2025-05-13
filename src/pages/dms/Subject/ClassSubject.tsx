import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
} from "@mui/material"
import { Edit, Delete, Add } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import {
  addSubject,
  deleteSubject,
  fetchSubjectsByClass,
  SubjectItem,
  updateSubject,
} from "../../../services/apis/dms/subjectService"
import { fetchClasses, ClassItem } from "../../../services/apis/dms/classService"
import PageTitle from "../../../components/PageTitle"
import AddBulkChapter from "../Chapter/AddBulkChapter"
import AddBulkSubject from "./AddBulkSubject"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../../../app/reducers/modalSlice"
import { showNotification } from "../../../app/reducers/headerSlice"

interface SubjectWithIndex extends SubjectItem {
  index: number;
}

const ClassSubject: React.FC = () => {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<SubjectItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem>({
    classId: "",
    subjectName: "",
    bookName: "",
    subjectDescription: "",
  })
  const [deleteSubjectId, setDeleteSubjectId] = useState<number | null>(null)
  const dispatch = useDispatch()

  const [isBulkAddChapterOpen, setIsBulkAddChapterOpen] = useState(false);
  const [selectedSubjectForChapter, setSelectedSubjectForChapter] = useState<SubjectItem | null>(null);
  const [isBulkAddSubjectOpen, setIsBulkAddSubjectOpen] = useState(false);

  useEffect(() => {
    dispatch(setPageTitle("Class Subjects"))
    const getClasses = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchClasses()
        setClasses(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getClasses()
  }, [])

  useEffect(() => {
    const getSubjects = async () => {
      if (selectedClassId) {
        setLoading(true)
        setError(null)
        try {
          const data = await fetchSubjectsByClass(selectedClassId)
          setSubjects(data)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      } else {
        setSubjects(null)
      }
    }

    getSubjects()
  }, [selectedClassId])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleClassChange = (event: SelectChangeEvent<string>) => {
    setSelectedClassId(event.target.value)
  }

  const handleOpenDialog = (subject?: SubjectItem) => {
    setSelectedSubject(
      subject || {
        classId: selectedClassId || "",
        subjectName: "",
        bookName: "",
        subjectDescription: "",
      },
    )
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSelectedSubject({
      ...selectedSubject,
      [event.target.name]: event.target.value,
    })
  }

  const getClassName = (classId: string | null): string | undefined => {
    return classes.find((cls) => cls.classId === classId)?.className;
  };

  // Helper function to get subject name by ID (you might need to fetch this)
  const getSubjectName = (subjectId: string | undefined): string | undefined => {
    return subjects?.find((sub) => sub.subjectId === subjectId)?.subjectName;
  };

  const handleSubmit = async () => {
    debugger;
    setLoading(true)
    setError(null)
    try {
      const subjectToSend = {
        ...selectedSubject,
        classId: selectedClassId || "",
      };
      if (selectedSubject.id) {
        // await updateSubject(selectedSubject.id, selectedSubject)
        await updateSubject(selectedSubject.id, subjectToSend)
        dispatch(
          showNotification({
            message: "Subject updated successfully",
            status: 1, // 1 for success
          }),
        )
      } else {
        // await addSubject({ ...selectedSubject, classId: selectedClassId || "" })
        await addSubject(subjectToSend);
        dispatch(
          showNotification({
            message: "Subject added successfully",
            status: 1, // 1 for success
          }),
        )
      }
      const updatedSubjects = await fetchSubjectsByClass(selectedClassId || "")
      setSubjects(updatedSubjects)
      setOpenDialog(false);
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenBulkAddChapterModal = (subject: SubjectItem) => {
    setSelectedSubjectForChapter(subject);
    setIsBulkAddChapterOpen(true);
  };

  const handleCloseBulkAddChapterModal = () => {
    setIsBulkAddChapterOpen(false);
    setSelectedSubjectForChapter(null);
  };

  const handleBulkAddSuccess = () => {
    // Optionally refresh the subjects or show a notification
    dispatch(showNotification({ message: "Chapters added successfully!", status: 1 }));
    handleCloseBulkAddChapterModal();
  };

  const handleOpenBulkAddSubjectModal = () => {
    setIsBulkAddSubjectOpen(true);
  };

  const handleCloseBulkAddSubjectModal = () => {
    setIsBulkAddSubjectOpen(false);
  };

  const handleBulkAddSubjectSuccess = () => {
    dispatch(showNotification({ message: "Subjects added successfully!", status: 1 }));
    // Refresh the subject list
    if (selectedClassId) {
      fetchSubjectsByClass(selectedClassId).then((data) => {
        setSubjects(data.map((subject, index) => ({ ...subject, index })));
      }).catch((err: any) => {
        dispatch(showNotification({ message: err.message, status: 0 }));
      });
    }
    handleCloseBulkAddSubjectModal();
  };

  const handleDeleteDialogOpen = (id: number) => {
    setDeleteSubjectId(id)
    setOpenDeleteDialog(true)
  }

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false)
    setDeleteSubjectId(null)
  }

  const handleDeleteConfirm = async () => {
    setLoading(true)
    setError(null)
    try {
      await deleteSubject(deleteSubjectId || 0)
      dispatch(
        showNotification({
          message: "Subject deleted successfully",
          status: 1, // 1 for success
        }),
      )
      setOpenDeleteDialog(false)
      const updatedSubjects = await fetchSubjectsByClass(selectedClassId || "")
      setSubjects(updatedSubjects)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageTitle />
      <Box sx={{ margin: "20px auto", maxWidth: "1200px" }}>
        <h2>Select a Class</h2>
        <FormControl fullWidth sx={{ marginBottom: "20px" }}>
          <InputLabel id="class-select-label">Select Class</InputLabel>
          <Select
            labelId="class-select-label"
            id="class-select"
            value={selectedClassId || ""}
            label="Select Class"
            onChange={handleClassChange}
          >
            {classes.map(cls => (
              <MenuItem key={cls.classId} value={cls.classId}>
                {cls.className}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedClassId && (
          <Box sx={{ marginTop: "20px" }}>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              marginBottom="10px"
            >
              <Grid item>
                <h3>Subjects</h3>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                  sx={{ marginRight: 2 }}
                >
                  Add Subject
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleOpenBulkAddSubjectModal}
                  >
                    Add Bulk Subjects
                  </Button>
              </Grid>
            </Grid>
            {loading && <p>Loading subjects...</p>}
            {error && <p>Error: {error}</p>}
            {subjects && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>Subject Name</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subjects
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((subject, index) => (
                        <TableRow key={subject.subjectId}>
                          <TableCell>
                            {index + 1 + page * rowsPerPage}
                          </TableCell>
                          <TableCell>{subject.subjectName}</TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleOpenDialog(subject)}
                            >
                              <Edit sx={{ color: "yellow" }} />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={() =>
                                handleDeleteDialogOpen(subject.id || 0)
                              }
                            >
                              <Delete sx={{ color: "red" }} />
                            </IconButton>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() =>
                                handleOpenBulkAddChapterModal(subject)
                              }
                            >
                              <Add />
                              Add Chapters
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={subjects.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            )}
          </Box>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {selectedSubject.id ? "Edit Subject" : "Add Subject"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="subjectName"
              name="subjectName"
              label="Subject Name"
              type="text"
              fullWidth
              value={selectedSubject.subjectName}
              onChange={handleInputChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="bookName"
              name="bookName"
              label="Book Name"
              type="text"
              fullWidth
              value={selectedSubject.bookName}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="subjectDescription"
              name="subjectDescription"
              label="Subject Description"
              type="text"
              fullWidth
              value={selectedSubject.subjectDescription}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="error">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {selectedSubject.id ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this subject?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>


        {selectedSubjectForChapter && (
          <AddBulkChapter
            isOpen={isBulkAddChapterOpen}
            classId={selectedClassId || ""}
            className={getClassName(selectedClassId)}
            subjectId={selectedSubjectForChapter.subjectId || ""}
            subjectName={getSubjectName(selectedSubjectForChapter.subjectId)}
            onSuccess={handleBulkAddSuccess}
            onClose={handleCloseBulkAddChapterModal}
          />
        )}

        <AddBulkSubject
          isOpen={isBulkAddSubjectOpen}
          classId={selectedClassId || ""}
          className={getClassName(selectedClassId)}
          onSuccess={handleBulkAddSubjectSuccess}
          onClose={handleCloseBulkAddSubjectModal}
        />
      </Box>
    </>
  )
}

export default ClassSubject
