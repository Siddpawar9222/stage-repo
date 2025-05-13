import React, { useState, useEffect } from "react"
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
  IconButton,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import { Download } from "@mui/icons-material" // Import the download icon
import { addAdditionalCharge, fetchClassDue } from "../../services/apis/pms/paymentService" // Import your service
import { fetchClasses, ClassItem } from "../../services/apis/dms/classService"
import { useDispatch } from "react-redux"; // Import useDispatch
import { openModal, setPageTitle } from "../../app/reducers/modalSlice";
import PageTitle from "../../components/PageTitle"
import { showNotification } from "../../app/reducers/headerSlice"
import { PAYMENT_CONSTANTS } from "../../utils/paymetUtils"

interface DueAmount {
  studentId: string
  dueAmount: number
  studentName: string
}

interface AdditionalChargeData {
  additionalChargeName: string;
  amount: number;
  dueDate: string;
  studentId: string;
}

const ClassDue: React.FC = () => {
  const [dueAmounts, setDueAmounts] = useState<DueAmount[]>([])
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [className, setClassName] = useState<string>("")
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false);
  const [studentsToAddCharge, setStudentsToAddCharge] = useState<string[]>([]);
  const [addChargeLoading, setAddChargeLoading] = useState(false);
  const [addChargeError, setAddChargeError] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Class Dues"));

    const fetchClassesData = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetchedClasses = await fetchClasses()
        setClasses(fetchedClasses)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchClassesData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (selectedClassId) {
        setLoading(true)
        setError(null)
        try {
          const response = await fetchClassDue({
            classId: selectedClassId, // Use the selected class ID
            pageNumber: 0,
            pageSize: 100,
          })
          setDueAmounts(response.data.content)
        } catch (err: any) {
          setError(err.message || "Failed to fetch class dues.")
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [selectedClassId])

  const handleClassSelect = (event: SelectChangeEvent<string>) => {
    const selectedClassId = event.target.value
    setSelectedClassId(selectedClassId)
    const selectedClass =
      classes?.find(cls => cls.classId === selectedClassId) ?? null
    setClassName(selectedClass ? selectedClass.className : "")
  }

  const handleDownload = async () => {
    if (selectedClassId) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchClassDue({
          classId: selectedClassId,
          pageNumber: -1, // Download all data
          pageSize: 1000000, // Large number to get all records
          download: true, // Set the download flag
        });

        if (typeof response === 'string') {
          // Create a download link for the CSV data
          const blob = new Blob([response], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${className}-data.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          setError("Download failed. Unexpected response from the server.");
        }
      } catch (err: any) {
        setError(err.message || 'Failed to download class dues.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddChargeDialogOpen = () => {
    const studentsWithDueAmountAbove200 = dueAmounts
      .filter((row) => row.dueAmount > 200)
      .map((row) => row.studentId);

    setStudentsToAddCharge(studentsWithDueAmountAbove200);
    setOpenDialog(true);
  };

  const handleAddChargeDialogClose = () => {
    setOpenDialog(false);
    setStudentsToAddCharge([]);
    setAddChargeError(null);
  };

  const handleAddChargeSubmit = async () => {
    if (studentsToAddCharge.length > 0) {
      setAddChargeLoading(true);
      try {
        // Add charges for all students
        const promises = studentsToAddCharge.map((studentId) =>
          addAdditionalCharge({
            studentId: studentId,
            additionalChargeName: 'Late Fine',
            amount: 50,
            dueDate: dueDate,
          })
        );
        await Promise.all(promises);

        setOpenDialog(false);
        setStudentsToAddCharge([]);

        // Dispatch success notification
        dispatch(
          showNotification({
            message: 'Additional charges added successfully.',
            status: 1, // 1 for success
          })
        );

        // Refresh the data by triggering the useEffect again
        if (selectedClassId) {
          const response = await fetchClassDue({
            classId: selectedClassId,
            pageNumber: 0,
            pageSize: 100,
          });
          setDueAmounts(response.data.content);
        }
      } catch (err: any) {
        setAddChargeError(err.message || 'Failed to add additional charge.');
      } finally {
        setAddChargeLoading(false);
      }
    }
  };

  const handleOpenAddLateFine = () => {
    dispatch(
      openModal({
        title: "Add Additional Charge to Class Due",
        bodyType: PAYMENT_CONSTANTS.ADD_ADDITIONAL_CHARGE_TO_CLASS_DUE,
        extraObject: {},
      }),
    )
  };
  

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <>
      <PageTitle />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        mt={2}
        mb={2}
        sx={{
          flexWrap: "wrap", 
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            [theme.breakpoints.down("sm")]: {
              width: "100%", 
            },
          }}

          onClick={handleOpenAddLateFine}
        >
          ADD LATE FINE
        </Button>
      </Box>

      <Box sx={{ margin: "20px auto", maxWidth: "1200px" }}>
        <h2>Select a Class</h2>
        <FormControl fullWidth>
          <InputLabel id="class-select-label">Class</InputLabel>
          <Select
            labelId="class-select-label"
            id="class-select"
            value={selectedClassId || ""}
            label="Class"
            onChange={handleClassSelect}
          >
            <MenuItem value="">Select a class</MenuItem>
            {classes && classes.length > 0 ? (
              classes.map(classItem => (
                <MenuItem key={classItem.id} value={classItem.classId}>
                  {classItem.className}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No classes available</MenuItem>
            )}
          </Select>
        </FormControl>
        {selectedClassId && (
          <Box sx={{ marginTop: "20px" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              sx={{
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "12px",
                borderRadius: "4px",
                background: theme.palette.background.paper,
              }}
            >
              <Typography variant="h6">
                {className} Class Dues Upto 31 March 2025
              </Typography>
              <Box>
                {/* <Button variant="contained" onClick={handleAddChargeDialogOpen}>
                  Add Additional Charge
                </Button> */}
                <IconButton aria-label="download" onClick={handleDownload}>
                  <Download />
                </IconButton>
              </Box>
            </Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Student Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Student Id</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Total Due</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dueAmounts.map(row => (
                    <TableRow
                      key={row.studentId}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.studentName}
                      </TableCell>
                      <TableCell align="left">{row.studentId}</TableCell>
                      <TableCell align="left">{row.dueAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Dialog for adding additional charge */}
        <Dialog open={openDialog} onClose={handleAddChargeDialogClose}>
          <DialogTitle>Add Additional Charge</DialogTitle>
          <DialogContent>
            <TextField label="Ledger Head" value="Late Fine" disabled fullWidth margin="normal" />
            <TextField label="Amount" value={50} disabled fullWidth margin="normal" />
            <TextField
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              margin="normal"
            />
            {addChargeError && <Typography color="error">{addChargeError}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddChargeDialogClose}>Cancel</Button>
            <Button onClick={handleAddChargeSubmit} variant="contained" disabled={addChargeLoading}>
              {addChargeLoading ? 'Adding...' : 'Add Charge'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default ClassDue;