// import React, { useEffect, useState } from "react"
// import {
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   SelectChangeEvent,
//   Typography,
//   Paper,
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   useTheme,
//   DialogContent,
//   DialogTitle,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Divider,
//   Pagination,
//   Tab,
//   Tabs,
//   PaginationItem,
//   IconButton,
//   Dialog,
//   TextField,
//   Snackbar,
//   Alert,
//   DialogContentText,
//   DialogActions,
//   InputAdornment,
// } from "@mui/material"
// import { fetchClasses, ClassItem } from "../../services/apis/dms/classService"
// import { Delete, Search } from "@mui/icons-material"
// import {
//   fetchStudents,
//   fetchPaymentSummary,
//   fetchTransactions,
//   fetchPaymentModes,
//   addStudentPayment,
//   deleteStudentPayment,
//   AddPaymentSuccessResponse,
//   fetchPaymentSummaryByStudentId,
// } from "../../services/apis/pms/paymentService"
// import { getStudentDetailsByStudentId } from "../../services/apis/dms/studentService"
// import { useNavigate } from "react-router-dom"
// import { roles } from "../../utils/roles"
// import { useRole } from "../../RoleContext"
// import { setPageTitle } from "../../app/reducers/modalSlice"
// import { useDispatch } from "react-redux"
// import PageTitle from "../../components/PageTitle"
// import { showNotification } from "../../app/reducers/headerSlice"
// import AccountSummaryPopOver from "./AccountSummaryPopOver"
// import PaymentGrid from "./PaymentGrid"

// interface Student {
//   studentId: string
//   studentName: string
//   email: string
//   fatherName: string
//   motherName: string
//   address: string
//   studentAdmissionDate: string
//   classStartDate: string
// }

// interface Transaction {
//   id: number
//   receiptId: string
//   paymentMode: string
//   paidAmount: number
//   paymentDate: string
// }

// interface Class {
//   id: number
//   classId: string
//   className: string
// }

// const StudentPayment: React.FC = () => {
//   const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
//   const [className, setClassName] = useState("")
//   const [students, setStudents] = useState<Student[]>([])
//   const [classes, setClasses] = useState<Class[]>([]) // State for classes
//   const [loading, setLoading] = useState<
//     "idle" | "pending" | "succeeded" | "failed"
//   >("idle")
//   const [error, setError] = useState<string | null>(null)
//   const [studentId, setStudentId] = useState("")
//   const [searchStudentId, setSearchStudentId] = useState("")
//   const [searchedStudent, setSearchedStudent] = useState<Student | null>(null)
//   const [selectedStudentId, setSelectedStudentId] = useState("")
//   const [studentName, setStudentName] = useState("")
//   const [paymentSummary, setPaymentSummary] = useState<any>(null)
//   const [transactions, setTransactions] = useState<Transaction[]>([])
//   const [totalTransactions, setTotalTransactions] = useState(0)
//   const [paymentModes, setPaymentModes] = useState<string[]>([])
//   const [openDialog, setOpenDialog] = useState(false)
//   const [selectedMode, setSelectedMode] = useState("")
//   const [upiId, setUpiId] = useState("")
//   const [amount, setAmount] = useState("")
//   const [currency, setCurrency] = useState("INR")
//   const selectedStudent = students.find(
//     student => student.studentId === (searchStudentId || selectedStudentId),
//   )
//   const selectedClass =
//     classes?.find(cls => cls.classId === selectedClassId) ?? null

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [deleteId, setDeleteId] = useState<number | null>(null)
//   const [remark, setRemark] = useState("")
//   const [page, setPage] = useState(0)
//   const [tabValue, setTabValue] = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(15)
//   const theme = useTheme()
//   const navigate = useNavigate()
//   const { userRole } = useRole()
//   const dispatch = useDispatch()

//   useEffect(() => {
//     dispatch(setPageTitle("Student Payment Details"))
//     const fetchClassData = async () => {
//       setLoading("pending")
//       setError(null)
//       try {
//         const fetchedClasses = await fetchClasses()
//         setClasses(fetchedClasses)
//         setStudents([])
//         setStudentName("")
//         setSelectedStudentId("")
//         setLoading("succeeded")
//       } catch (err: any) {
//         setError(err.message)
//         setLoading("failed")
//       }
//     }
//     fetchClassData()
//   }, [])

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       if (selectedClassId) {
//         setLoading("pending")
//         setError(null)
//         try {
//           const fetchedStudents = await fetchStudents(selectedClassId)
//           setStudents(fetchedStudents)

//           setLoading("succeeded")
//         } catch (err: any) {
//           setError(err.message)
//           setLoading("failed")
//         }
//       }
//     }
//     fetchStudentData()
//   }, [selectedClassId])

//   const handleClassSelect = (event: SelectChangeEvent<string>) => {
//     const selectedClassId = event.target.value
//     setSelectedClassId(selectedClassId)
//     const selectedClass =
//       classes?.find(cls => cls.classId === selectedClassId) ?? null
//     setClassName(selectedClass ? selectedClass.className : "")
//     setStudents([])
//     setStudentName("")
//     setSelectedStudentId("")
//     setStudentId("")
//     setSearchedStudent(null)
//     setSearchStudentId("")
//   }

//   useEffect(() => {
//     if (selectedClassId && selectedStudentId) {
//       const fetchSummaryData = async () => {
//         setLoading("pending")
//         setError(null)
//         try {
//           const fetchedSummary = await fetchPaymentSummary({
//             classId: selectedClassId,
//             studentId: selectedStudentId,
//           })
//           setPaymentSummary(fetchedSummary)
//           setLoading("succeeded")
//         } catch (err: any) {
//           setError(err.message)
//           setLoading("failed")
//         }
//       }
//       fetchSummaryData()
//       setSearchedStudent(null)
//     }
//   }, [selectedClassId, selectedStudentId])

//   useEffect(() => {
//     if (selectedStudentId) {
//       const fetchSummaryData = async () => {
//         setLoading("pending")
//         setError(null)
//         try {
//           const fetchedSummary = await fetchPaymentSummaryByStudentId({
//             studentId: selectedStudentId,
//           })
//           setPaymentSummary(fetchedSummary)
//           setLoading("succeeded")
//         } catch (err: any) {
//           setError(err.message)
//           setLoading("failed")
//         }
//       }
//       fetchSummaryData()
//     }
//   }, [selectedStudentId])

//   useEffect(() => {
//     const fetchTransactionData = async () => {
//       if (selectedStudentId) {
//         setLoading("pending")
//         setError(null)
//         try {
//           const fetchedTransactions = await fetchTransactions({
//             studentId: selectedStudentId,
//             pageNumber: page,
//             pageSize: rowsPerPage,
//           })
//           setTransactions(fetchedTransactions.content)
//           setTotalTransactions(fetchedTransactions.totalElements)
//           setLoading("succeeded")
//         } catch (err: any) {
//           setError(err.message)
//           setLoading("failed")
//         }
//       }
//     }
//     fetchTransactionData()
//   }, [selectedStudentId, page, rowsPerPage])

//   const fetchStudentByStudentId = async (studentId: string | undefined) => {
//     setLoading("pending")
//     setError(null)
//     try {
//       if (!studentId) {
//         setError("Student ID is required.")
//         setLoading("failed")
//         return
//       }
//       const response = await getStudentDetailsByStudentId(studentId)
//       if (response?.status !== 200) {
//         setError(response?.statusText || "An error occurred.")
//         setLoading("failed")
//       } else {
//         setSearchedStudent(response?.data?.data || null)
//         setLoading("succeeded")
//       }
//     } catch (err: any) {
//       setError(err.message || "An unexpected error occurred.")
//       setLoading("failed")
//     }
//   }

//   useEffect(() => {
//     const fetchModes = async () => {
//       if (openDialog) {
//         setLoading("pending")
//         setError(null)
//         try {
//           const modes = await fetchPaymentModes()
//           setPaymentModes(modes)
//           setLoading("succeeded")
//         } catch (err: any) {
//           setError(err.message)
//           setLoading("failed")
//         }
//       }
//     }
//     fetchModes()
//   }, [openDialog])

//   const handleStudentChange = (event: SelectChangeEvent) => {
//     const selectedId = event.target.value
//     setSelectedStudentId(selectedId)
//     const selectedStudent = students.find(
//       student => student.studentId === (selectedId || studentId),
//     )
//     if (selectedStudent) {
//       setStudentName(selectedStudent.studentName)
//     } else {
//       setStudentName("")
//     }
//   }

//   const handleSubmit = async () => {
//     if (!selectedStudentId) {
//       alert("Student ID is required!")
//       return
//     }

//     setLoading("pending")
//     setError(null)
//     try {
//       const response = await addStudentPayment({
//         studentId: selectedStudentId,
//         classId: selectedClassId ?? "",
//         studentName: studentName,
//         upiId: upiId,
//         paymentMode: selectedMode,
//         amount: parseFloat(amount),
//         currency,
//         remark,
//       })

//       if (typeof response === "string") {
//         setError(response) // Set the error state
//       } else {
//         const typedResponse = response as AddPaymentSuccessResponse
//         dispatch(
//           showNotification({
//             message: typedResponse.message,
//             status: 1, // 1 for success
//           }),
//         )
//         setSelectedMode("")
//         setAmount("")
//         setUpiId("")
//         setCurrency("")
//         setRemark("")
//         setOpenDialog(false)
//         navigate("/payment-success", {
//           state: { ...typedResponse, studentName },
//         })
//         const updatedSummary = await fetchPaymentSummary({
//           classId: selectedClassId ?? "",
//           studentId: selectedStudentId,
//         })
//         setPaymentSummary(updatedSummary)
//       }

//       const updatedSummary = await fetchPaymentSummary({
//         classId: selectedClassId ?? "",
//         studentId: selectedStudentId,
//       })
//       setPaymentSummary(updatedSummary)
//     } catch (err: any) {
//       setError(err.message)
//       dispatch(
//         showNotification({
//           message: "Failed to add Payment",
//           status: 0, // 1 for success
//         }),
//       )
//     } finally {
//       setLoading("succeeded")
//     }
//   }

//   const handleDeleteDialogOpen = (id: number) => {
//     setDeleteId(id)
//     setDeleteDialogOpen(true)
//   }

//   const handleDeleteDialogClose = () => {
//     setDeleteDialogOpen(false)
//     setDeleteId(null)
//   }

//   const confirmDeletePayment = async () => {
//     if (deleteId) {
//       setLoading("pending")
//       setError(null)
//       try {
//         const message = await deleteStudentPayment(deleteId)
//         dispatch(
//           showNotification({
//             message: message,
//             status: 1,
//           }),
//         )
//         handleDeleteDialogClose()
//         // Refresh transaction data after deletion
//         const fetchedTransactions = await fetchTransactions({
//           studentId: selectedStudentId,
//           pageNumber: page,
//           pageSize: rowsPerPage,
//         })
//         setTransactions(fetchedTransactions.content)
//         setTotalTransactions(fetchedTransactions.totalElements)
//         setLoading("succeeded")
//       } catch (err: any) {
//         setError(err.message)
//         dispatch(
//           showNotification({
//             message: err.message,
//             status: 0,
//           }),
//         )
//         setLoading("failed")
//       }
//     }
//   }

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue)
//   }

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value
//     setStudentId(value)
//   }

//   const handleSearch = async () => {
//     setSearchStudentId(studentId)
//     setSelectedStudentId(studentId)
//     setSelectedClassId(null)
//     setClassName("")
//     setSelectedStudentId("")

//     await fetchStudentByStudentId(studentId)
//   }

//   return (
//     <>
//       <PageTitle />
//       <Box sx={{ margin: "20px auto", maxWidth: "1200px" }}>
//         {/* <h2>Select a Class</h2> */}
//         <Box>
//           <TextField
//             label="Enter Student ID to Search"
//             variant="outlined"
//             value={studentId}
//             onChange={handleChange}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <Button onClick={handleSearch} variant="contained">
//                     <Search />
//                   </Button>
//                 </InputAdornment>
//               ),
//             }}
//             fullWidth
//           />
//         </Box>
//         <Box sx={{ display: "flex", gap: 2, marginTop: "20px" }}>
//           <FormControl fullWidth sx={{ flex: 1 }}>
//             <InputLabel id="class-select-label">Select Class</InputLabel>
//             <Select
//               labelId="class-select-label"
//               id="class-select"
//               value={selectedClassId || ""} // Use the state variable, not the setter
//               label="Class"
//               onChange={handleClassSelect}
//             >
//               <MenuItem value="">Select a class</MenuItem>
//               {classes && classes.length > 0 ? (
//                 classes.map(classItem => (
//                   <MenuItem key={classItem.id} value={classItem.classId}>
//                     {classItem.className}
//                   </MenuItem>
//                 ))
//               ) : (
//                 <MenuItem disabled>No classes available</MenuItem>
//               )}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth sx={{ flex: 1 }}>
//             <InputLabel id="student-select-label">Select Student</InputLabel>
//             <Select
//               labelId="student-select-label"
//               id="student-select"
//               value={selectedStudentId || ""}
//               label="Select Student"
//               onChange={handleStudentChange}
//             >
//               {students.map(student => (
//                 <MenuItem key={student.studentId} value={student.studentId}>
//                   {student.studentId}---{student.studentName}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Box>

//         <Box sx={{ pt: 3 }}>
//           {loading === "pending" && <CircularProgress />}

//           {(selectedStudent || studentId) && (
//             <Box>
//               <Tabs
//                 value={tabValue}
//                 onChange={handleTabChange}
//                 aria-label="payment tabs"
//               >
//                 <Tab label="Student Dues" />
//                 <Tab label="Latest Transactions" />
//               </Tabs>

//               {tabValue === 0 && (
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={6}>
//                     {paymentSummary &&
//                       Object.keys(paymentSummary).length > 0 && (
//                         <Paper
//                           sx={{
//                             p: 2,
//                             backgroundColor: theme.palette.background.paper,
//                             display: "flex",
//                             flexDirection: "column",
//                             height: "100%",
//                           }}
//                         >
//                           <Typography
//                             sx={{ fontWeight: "bold", fontSize: "22px" }}
//                           >
//                             Due Summary
//                           </Typography>
//                           <Divider />
//                           <DialogContent>
//                             {(() => {
//                               const months = Object.keys(paymentSummary)
//                               const latestMonth = months[0] // Extracting the first month in the response
//                               const latestSummary = paymentSummary[latestMonth]

//                               return (
//                                 <Box key={latestMonth} sx={{ mb: 1 }}>
//                                   <Typography
//                                     variant="subtitle1"
//                                     sx={{ fontWeight: "bold" }}
//                                   >
//                                     {latestMonth}
//                                   </Typography>
//                                   <Box
//                                     sx={{
//                                       display: "flex",
//                                       justifyContent: "space-between",
//                                     }}
//                                   >
//                                     <Typography>Total Due Amount: </Typography>
//                                     <Typography sx={{ color: "red" }}>
//                                       ₹
//                                       {latestSummary?.cumulativeDue?.amount ??
//                                         0}
//                                     </Typography>
//                                   </Box>
//                                   <Button
//                                     variant="contained"
//                                     sx={{ mt: 2 }}
//                                     fullWidth
//                                     onClick={() => setOpenDialog(true)}
//                                     disabled={
//                                       (latestSummary?.cumulativeDue?.amount ??
//                                         0) <= 0
//                                     } // Disable if amount is 0 or negative
//                                   >
//                                     Pay ₹
//                                     {latestSummary?.cumulativeDue?.amount ?? 0}
//                                   </Button>
//                                 </Box>
//                               )
//                             })()}
//                           </DialogContent>
//                         </Paper>
//                       )}
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     {(selectedStudentId || searchedStudent) && (
//                       <Paper
//                         sx={{
//                           p: 2,
//                           mb: 2,
//                           backgroundColor: theme.palette.background.paper,
//                           display: "flex",
//                           flexDirection: "column",
//                           height: "100%",
//                         }}
//                       >
//                         <Typography
//                           sx={{ fontWeight: "bold", fontSize: "22px" }}
//                         >
//                           Student Information
//                         </Typography>
//                         <Divider />
//                         <DialogContent>
//                           {searchedStudent || selectedStudent ? (
//                             <>
//                               <Typography>
//                                 <b>Name:</b>{" "}
//                                 {
//                                   (searchedStudent || selectedStudent)
//                                     ?.studentName
//                                 }
//                               </Typography>
//                               <Typography>
//                                 <b>Student ID:</b>{" "}
//                                 {
//                                   (searchedStudent || selectedStudent)
//                                     ?.studentId
//                                 }
//                               </Typography>
//                               <Typography>
//                                 <b>Email:</b>{" "}
//                                 {(searchedStudent || selectedStudent)?.email}
//                               </Typography>
//                               <Typography>
//                                 <b>Class:</b> {className}
//                               </Typography>
//                               <Typography>
//                                 <b>Father Name:</b>{" "}
//                                 {
//                                   (searchedStudent || selectedStudent)
//                                     ?.fatherName
//                                 }
//                               </Typography>
//                               <Typography>
//                                 <b>Mother Name:</b>{" "}
//                                 {
//                                   (searchedStudent || selectedStudent)
//                                     ?.motherName
//                                 }
//                               </Typography>
//                               <Typography>
//                                 <b>Address:</b>{" "}
//                                 {(searchedStudent || selectedStudent)?.address}
//                               </Typography>
//                               <Typography>
//                                 <b>Admission Date:</b>{" "}
//                                 {
//                                   (searchedStudent || selectedStudent)
//                                     ?.studentAdmissionDate
//                                 }
//                               </Typography>
//                               <Typography>
//                                 <b>Class Start Date:</b>{" "}
//                                 {
//                                   (searchedStudent || selectedStudent)
//                                     ?.classStartDate
//                                 }
//                               </Typography>
//                             </>
//                           ) : (
//                             <Typography>
//                               No student information available.
//                             </Typography>
//                           )}
//                         </DialogContent>
//                       </Paper>
//                     )}
//                   </Grid>
//                 </Grid>
//               )}

//               {paymentSummary && tabValue === 0 && (
//                 <Paper sx={{ p: 2, mt: 2 }}>
//                   <DialogTitle sx={{ p: 1, mb: 2 }}>
//                     Payment Details
//                   </DialogTitle>
//                   <DialogContent>
//                     <TableContainer component={Paper}>
//                       <Table aria-label="payment summary table">
//                         <TableHead>
//                           <TableRow>
//                             <TableCell sx={{ fontWeight: "550" }}>
//                               Date Range
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "550" }}>
//                               Class Charge
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "550" }}>
//                               Additional Charge
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "550" }}>
//                               Discount
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "550" }}>
//                               Paid Amount
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "550" }}>
//                               Cumulative Due Amount
//                             </TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {paymentSummary &&
//                             Object.entries(paymentSummary).map(
//                               ([monthYear, summary]: [string, any]) => {
//                                 const classCharge =
//                                   summary?.Charge?.total ?? "NA"
//                                 const additionalCharge =
//                                   summary?.AdditionalCharge?.total ?? "NA"
//                                 const paidAmount =
//                                   summary?.StudentPayment?.total ?? "NA"
//                                 const cumulativeDue =
//                                   summary?.cumulativeDue?.amount ?? "NA"

//                                 return (
//                                   <TableRow key={monthYear}>
//                                     <TableCell>{monthYear}</TableCell>
//                                     <TableCell>
//                                       {classCharge !== "NA" && (
//                                         <AccountSummaryPopOver
//                                           id={`class-charge-${monthYear}`}
//                                           text={classCharge}
//                                           onHoverText={summary?.Charge || {}}
//                                         />
//                                       )}
//                                       {classCharge === "NA" && "NA"}
//                                     </TableCell>
//                                     <TableCell>
//                                       {additionalCharge !== "NA" && (
//                                         <AccountSummaryPopOver
//                                           id={`additional-charge-${monthYear}`}
//                                           text={additionalCharge}
//                                           onHoverText={
//                                             summary?.AdditionalCharge || {}
//                                           }
//                                         />
//                                       )}
//                                       {additionalCharge === "NA" && "NA"}
//                                     </TableCell>
//                                     <TableCell>NA</TableCell>
//                                     <TableCell>
//                                       {paidAmount !== "NA" && (
//                                         <AccountSummaryPopOver
//                                           id={`paid-amount-${monthYear}`}
//                                           text={paidAmount}
//                                           onHoverText={
//                                             summary?.StudentPayment || {}
//                                           }
//                                         />
//                                       )}
//                                       {paidAmount === "NA" && "NA"}
//                                     </TableCell>
//                                     <TableCell>
//                                       <Button
//                                         variant="contained"
//                                         color="warning"
//                                       >
//                                         ₹{cumulativeDue}
//                                       </Button>
//                                     </TableCell>
//                                   </TableRow>
//                                 )
//                               },
//                             )}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   </DialogContent>
//                 </Paper>
//               )}

//               {tabValue === 1 && selectedStudentId && (
//                 <Paper sx={{ p: 2, mt: 2 }}>
//                   <DialogTitle>Latest Transactions</DialogTitle>
//                   <DialogContent>
//                     <TableContainer
//                       component={Paper}
//                       sx={{ boxShadow: "none" }}
//                     >
//                       <Table aria-label="latest transactions table">
//                         <TableHead>
//                           <TableRow>
//                             <TableCell>Receipt ID</TableCell>
//                             <TableCell>Payment Mode</TableCell>
//                             <TableCell>Amount</TableCell>
//                             <TableCell>Payment Date</TableCell>
//                             {userRole === roles.admin[0] && (
//                               <TableCell>Action</TableCell>
//                             )}
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {transactions.map(transaction => (
//                             <TableRow key={transaction.id}>
//                               <TableCell>{transaction.receiptId}</TableCell>
//                               <TableCell>{transaction.paymentMode}</TableCell>
//                               <TableCell>{transaction.paidAmount}</TableCell>
//                               <TableCell>{transaction.paymentDate}</TableCell>
//                               {userRole === roles.admin[0] && (
//                                 <TableCell>
//                                   <IconButton
//                                     onClick={() =>
//                                       handleDeleteDialogOpen(transaction.id)
//                                     }
//                                   >
//                                     <Delete sx={{ color: "red" }} />
//                                   </IconButton>
//                                 </TableCell>
//                               )}
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   </DialogContent>
//                 </Paper>
//               )}
//             </Box>
//           )}

//           <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//             <DialogTitle>Add Student Payment for {studentName}</DialogTitle>
//             <DialogContent>
//               <Typography variant="subtitle1" sx={{ m: 2 }}>
//                 Enter the new payment info below.
//               </Typography>
//               <Select
//                 fullWidth
//                 value={selectedMode}
//                 onChange={e => setSelectedMode(e.target.value)}
//                 displayEmpty
//                 sx={{ mb: 2 }}
//               >
//                 <MenuItem value="" disabled>
//                   Select Payment Mode
//                 </MenuItem>
//                 {paymentModes.map((mode, index) => (
//                   <MenuItem key={index} value={mode}>
//                     {mode}
//                   </MenuItem>
//                 ))}
//               </Select>

//               {selectedMode === "UPI" && (
//                 <TextField
//                   label="UPI ID"
//                   fullWidth
//                   value={upiId}
//                   onChange={e => setUpiId(e.target.value)}
//                   sx={{ mb: 2 }}
//                 />
//               )}

//               <TextField
//                 label="Amount"
//                 type="number"
//                 fullWidth
//                 value={amount}
//                 onChange={e => setAmount(e.target.value)}
//                 sx={{ mb: 2 }}
//               />

//               <TextField
//                 label="Currency Number"
//                 type="number"
//                 fullWidth
//                 value={currency}
//                 onChange={e => setCurrency(e.target.value)}
//                 sx={{ mb: 2 }}
//               />

//               <TextField
//                 label="Remark"
//                 fullWidth
//                 multiline
//                 // rows={2}
//                 value={remark}
//                 onChange={e => setRemark(e.target.value)}
//                 sx={{ mb: 2 }}
//               />

//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   gap: 2,
//                   mt: 2,
//                 }}
//               >
//                 <Button onClick={() => setOpenDialog(false)} variant="outlined">
//                   Close
//                 </Button>
//                 <Button
//                   onClick={handleSubmit}
//                   variant="contained"
//                   color="primary"
//                 >
//                   {loading === "pending" ? "Processing..." : "Add Payment"}
//                 </Button>
//               </Box>
//             </DialogContent>
//           </Dialog>

//           <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
//             <DialogContent>
//               <DialogContentText>
//                 Are you sure you want to delete this payment record?
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleDeleteDialogClose} color="primary">
//                 Cancel
//               </Button>
//               <Button
//                 onClick={confirmDeletePayment}
//                 color="error"
//                 variant="contained"
//               >
//                 Delete
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Box>
//       </Box>
//     </>
//   )
// }

// export default StudentPayment











































































import React, { useEffect, useMemo, useState } from "react"
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Grid,
  useTheme,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Pagination,
  Tab,
  Tabs,
  PaginationItem,
  IconButton,
  Dialog,
  TextField,
  Snackbar,
  Alert,
  DialogContentText,
  DialogActions,
  InputAdornment,
} from "@mui/material"
import { fetchClasses, ClassItem } from "../../services/apis/dms/classService"
import { Delete, Search } from "@mui/icons-material"
import {
  fetchStudents,
  fetchPaymentSummary,
  fetchTransactions,
  fetchPaymentModes,
  addStudentPayment,
  deleteStudentPayment,
  AddPaymentSuccessResponse,
  fetchPaymentSummaryByStudentId,
} from "../../services/apis/pms/paymentService"
import { getStudentDetailsByStudentId } from "../../services/apis/dms/studentService"
import { useNavigate } from "react-router-dom"
import { roles } from "../../utils/roles"
import { useRole } from "../../RoleContext"
import { setPageTitle } from "../../app/reducers/modalSlice"
import { useDispatch } from "react-redux"
import PageTitle from "../../components/PageTitle"
import { showNotification } from "../../app/reducers/headerSlice"
import AccountSummaryPopOver from "./AccountSummaryPopOver"
import PaymentGrid from "./PaymentGrid"

interface Student {
  studentId: string
  studentName: string
  email: string
  fatherName: string
  motherName: string
  address: string
  studentAdmissionDate: string
  classStartDate: string
}

interface Transaction {
  id: number
  receiptId: string
  paymentMode: string
  paidAmount: number
  paymentDate: string
}

interface Class {
  id: number
  classId: string
  className: string
}

const StudentPayment: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [className, setClassName] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([]) // State for classes
  const [loading, setLoading] = useState<
    "idle" | "pending" | "succeeded" | "failed"
  >("idle")
  const [error, setError] = useState<string | null>(null)
  const [studentId, setStudentId] = useState("")
  const [searchStudentId, setSearchStudentId] = useState("")
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [studentName, setStudentName] = useState("")
  const [paymentSummary, setPaymentSummary] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [paymentModes, setPaymentModes] = useState<string[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedMode, setSelectedMode] = useState("")
  const [upiId, setUpiId] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("INR")
  const selectedStudent = students.find(
    student => student.studentId === (searchStudentId || selectedStudentId),
  )
  const selectedClass =
    classes?.find(cls => cls.classId === selectedClassId) ?? null
    const selectedStudentObject = useMemo(
      () => students.find(student => student.studentId === (searchStudentId || selectedStudentId)),
      [students, searchStudentId, selectedStudentId]
    );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [remark, setRemark] = useState("")
  const [page, setPage] = useState(0)
  const [tabValue, setTabValue] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const theme = useTheme()
  const navigate = useNavigate()
  const { userRole } = useRole()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle("Student Payment Details"))
    const fetchClassData = async () => {
      setLoading("pending")
      setError(null)
      try {
        const fetchedClasses = await fetchClasses()
        setClasses(fetchedClasses)
        setStudents([])
        setStudentName("")
        setSelectedStudentId("")
        setLoading("succeeded")
      } catch (err: any) {
        setError(err.message)
        setLoading("failed")
      }
    }
    fetchClassData()
  }, [])

  useEffect(() => {
    const fetchStudentData = async () => {
      if (selectedClassId) {
        setLoading("pending")
        setError(null)
        try {
          const fetchedStudents = await fetchStudents(selectedClassId)
          setStudents(fetchedStudents)

          setLoading("succeeded")
        } catch (err: any) {
          setError(err.message)
          setLoading("failed")
        }
      }
    }
    fetchStudentData()
  }, [selectedClassId])

  const fetchStudentByStudentId = async (studentId: string | undefined) => {
        setLoading("pending")
        setError(null)
        try {
          if (!studentId) {
            setError("Student ID is required.")
            setLoading("failed")
            return
          }
          const response = await getStudentDetailsByStudentId(studentId)
          if (response?.status !== 200) {
            setError(response?.statusText || "An error occurred.")
            setLoading("failed")
          } else {
            setSearchedStudent(response?.data?.data || null)
            setLoading("succeeded")
          }
        } catch (err: any) {
          setError(err.message || "An unexpected error occurred.")
          setLoading("failed")
        }
      }

  const handleClassSelect = (event: SelectChangeEvent<string>) => {
    const selectedClassId = event.target.value
    setSelectedClassId(selectedClassId)
    const selectedClass =
      classes?.find(cls => cls.classId === selectedClassId) ?? null
    setClassName(selectedClass ? selectedClass.className : "")
    setStudents([])
    setStudentName("")
    setSelectedStudentId("")
    setStudentId("")
    setSearchedStudent(null)
    setSearchStudentId("")
  }

  const handleStudentChange = (event: SelectChangeEvent) => {
    const selectedId = event.target.value
    setSelectedStudentId(selectedId)
    const selectedStudent = students.find(
      student => student.studentId === (selectedId || studentId),
    )
    if (selectedStudent) {
      setStudentName(selectedStudent.studentName)
    } else {
      setStudentName("")
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setStudentId(value)
  }

  const handleSearch = async () => {
    setSearchStudentId(studentId)
    setSelectedStudentId(studentId)
    setSelectedClassId(null)
    setClassName("")
    setSelectedStudentId("")

    await fetchStudentByStudentId(studentId)
  }

  return (
    <>
      <PageTitle />
      <Box sx={{ margin: "20px auto", maxWidth: "1200px" }}>
        <Box>
          <TextField
            label="Enter Student ID to Search"
            variant="outlined"
            value={studentId}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={handleSearch} variant="contained">
                    <Search />
                  </Button>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2, marginTop: "20px" }}>
          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel id="class-select-label">Select Class</InputLabel>
            <Select
              labelId="class-select-label"
              id="class-select"
              value={selectedClassId || ""} // Use the state variable, not the setter
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

          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel id="student-select-label">Select Student</InputLabel>
            <Select
              labelId="student-select-label"
              id="student-select"
              value={selectedStudentId || ""}
              label="Select Student"
              onChange={handleStudentChange}
            >
              {students.map(student => (
                <MenuItem key={student.studentId} value={student.studentId}>
                  {student.studentId}---{student.studentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ pt: 3 }}>
          {loading === "pending" && <CircularProgress />}

          {(searchStudentId || selectedStudentId || searchedStudent) && (
            <PaymentGrid
              selectedClassId={selectedClassId}
              selectedStudentId={selectedStudentId}
              studentName={studentName}
              selectedStudent={selectedStudentObject}
              searchedStudent={searchedStudent}
              setLoading={setLoading}
              setError={setError}
            />
          )}
        </Box>
      </Box>
    </>
  )
}

export default StudentPayment
