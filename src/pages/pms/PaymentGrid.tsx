import React, { useState, useEffect } from "react"
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Select,
  MenuItem,
  IconButton,
  FormHelperText,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material"
import { Delete } from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"
import {
  fetchPaymentSummary,
  fetchTransactions,
  fetchPaymentModes,
  addStudentPayment,
  deleteStudentPayment,
  AddPaymentSuccessResponse,
  fetchPaymentSummaryByStudentId,
  fetchTotalRemainingDueAmount,
} from "../../services/apis/pms/paymentService"
import { useDispatch } from "react-redux"
import { useRole } from "../../RoleContext"
import { roles } from "../../utils/roles"
import { showNotification } from "../../app/reducers/headerSlice"
import { useNavigate } from "react-router-dom"
import AccountSummaryPopOver from "./AccountSummaryPopOver"

export interface Student {
  studentId: string
  studentName: string
  email: string
  fatherName: string
  motherName: string
  address: string
  studentAdmissionDate: string
  classStartDate: string
}

interface PaymentGridProps {
  selectedClassId: string | null
  selectedStudentId: string | null
  studentName: string
  selectedStudent: Student | undefined
  searchedStudent: Student | null
  profileStudentId?: string | null
  setLoading: React.Dispatch<
    React.SetStateAction<"idle" | "pending" | "succeeded" | "failed">
  >
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

const PaymentGrid: React.FC<PaymentGridProps> = ({
  selectedClassId,
  selectedStudentId,
  studentName,
  selectedStudent,
  searchedStudent,
  profileStudentId,
  setError,
}) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userRole } = useRole()
  const pathname = window.location.pathname
  const [paymentSummary, setPaymentSummary] = useState<any>(null)
  const [tabValue, setTabValue] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedMode, setSelectedMode] = useState<string>("")
  const [paymentModes, setPaymentModes] = useState<string[]>([])
  const [amount, setAmount] = useState<string>("")
  const [upiId, setUpiId] = useState<string>("")
  const [currency, setCurrency] = useState<string>("")
  const [remark, setRemark] = useState<string>("")
  const [transactions, setTransactions] = useState<any[]>([])
  const [totalTransactions, setTotalTransactions] = useState<number>(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState<
    "idle" | "pending" | "succeeded" | "failed"
  >("idle")
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [paymentDialogStudentName, setPaymentDialogStudentName] =
    useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [amountError, setAmountError] = useState<string | null>(null)
  const currentDueAmount =
    paymentSummary?.[Object.keys(paymentSummary)[0]]?.cumulativeDue?.amount ?? 0

  const [advancePaymentState, setAdvancePaymentState] = useState({
    enabled: false,
    amount: 0,
    loading: false,
  });

  const fetchSummaryData = async () => {
    setLoading("pending")
    setError(null)
    let studentIdToFetch =
      searchedStudent?.studentId ||
      selectedStudent?.studentId ||
      profileStudentId
    let fetchFunctionToUse: ((payload: any) => Promise<any>) | undefined
    let payload: any = {}

    if (studentIdToFetch) {
      if (selectedClassId) {
        fetchFunctionToUse = fetchPaymentSummary
        payload = { classId: selectedClassId, studentId: studentIdToFetch }
      } else {
        fetchFunctionToUse = fetchPaymentSummaryByStudentId
        payload = { studentId: studentIdToFetch }
      }

      if (fetchFunctionToUse) {
        try {
          const fetchedSummary = await fetchFunctionToUse(payload)
          setPaymentSummary(fetchedSummary)
          setLoading("succeeded")
        } catch (err: any) {
          setError(err.message)
          setLoading("failed")
        }
      } else {
        setPaymentSummary(null)
      }
    } else {
      setPaymentSummary(null)
    }
  }

  useEffect(() => {
    fetchSummaryData()
  }, [
    selectedClassId,
    selectedStudent?.studentId,
    searchedStudent,
    profileStudentId,
    setLoading,
    setError,
    fetchPaymentSummary,
    fetchPaymentSummaryByStudentId,
  ])

  const fetchTransactionData = async () => {
    setLoading("pending")
    setError(null)
    const studentIdToFetch =
      searchedStudent?.studentId ||
      selectedStudent?.studentId ||
      profileStudentId

    if (studentIdToFetch) {
      try {
        const fetchedTransactions = await fetchTransactions({
          studentId: studentIdToFetch,
          pageNumber: page,
          pageSize: rowsPerPage,
        })
        setTransactions(fetchedTransactions.content)
        setTotalTransactions(fetchedTransactions.totalElements)
        setLoading("succeeded")
      } catch (err: any) {
        setError(err.message)
        setLoading("failed")
      }
    } else {
      setTransactions([])
      setTotalTransactions(0)
    }
  }

  useEffect(() => {
    fetchTransactionData()
  }, [
    selectedStudent?.studentId,
    searchedStudent?.studentId,
    profileStudentId,
    page,
    rowsPerPage,
    setLoading,
    setError,
    fetchTransactions,
  ])

  useEffect(() => {
    const fetchModes = async () => {
      if (openDialog) {
        setLoading("pending")
        setError(null)
        try {
          const modes = await fetchPaymentModes()
          setPaymentModes(modes)
          setLoading("succeeded")
        } catch (err: any) {
          setError(err.message)
          setLoading("failed")
        }
      }
    }
    fetchModes()
  }, [openDialog, setLoading, setError])

  const handleOpenDialog = () => {
    if (searchedStudent) {
      setPaymentDialogStudentName(searchedStudent.studentName)
    } else {
      setPaymentDialogStudentName(studentName)
    }
    setOpenDialog(true)
    setAmountError(null) // Reset error when opening dialog
    setAmount("")
    setSelectedMode("")
    setUpiId("")
    setCurrency("")
    setRemark("")
    setAdvancePaymentState({ enabled: false, amount: 0, loading: false });
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)

    if (advancePaymentState.enabled) {
      if (advancePaymentState.amount !== 0 && parseFloat(e.target.value) > advancePaymentState.amount) {
        setAmountError(`Amount cannot be more than the total amount: ₹${advancePaymentState.amount}`)
        return;
      }
    } else {
      if (currentDueAmount !== 0 && parseFloat(e.target.value) > currentDueAmount) {
        setAmountError(`Amount cannot be more than the due amount: ₹${currentDueAmount}`)
        return;
      }
    }
    setAmountError(null)
  }

  const handleSubmit = async () => {
    const studentIdForPayment = searchedStudent?.studentId || selectedStudentId
    const currentStudentName = searchedStudent?.studentName || studentName

    if (!studentIdForPayment) {
      alert("Student ID is required!")
      return
    }

    if (!amount) {
      setAmountError("Amount is required")
      return
    }

    if (amountError) {
      return
    }

    setIsSubmitting(true)
    setLoading("pending")
    setError(null)
    try {
      const response = await addStudentPayment({
        // studentId: selectedStudentId || searchedStudent?.studentId,
        studentId: studentIdForPayment,
        classId: selectedClassId ?? "",
        // studentName: studentName,
        studentName: currentStudentName,
        upiId: upiId,
        paymentMode: selectedMode,
        amount: parseFloat(amount),
        currency,
        remark,
      })

      if (typeof response === "string") {
        setError(response) // Set the error state
      } else {
        const typedResponse = response as AddPaymentSuccessResponse
        dispatch(
          showNotification({
            message: typedResponse.message,
            status: 1, // 1 for success
          }),
        )
        setSelectedMode("")
        setAmount("")
        setUpiId("")
        setCurrency("")
        setRemark("")
        setOpenDialog(false)
        navigate("/payment-success", {
          // state: { ...typedResponse, studentName },
          state: { ...typedResponse, studentName: currentStudentName },
        })
        const updatedSummary = await fetchPaymentSummary({
          classId: selectedClassId ?? "",
          // studentId: selectedStudentId,
          studentId: studentIdForPayment,
        })
        setPaymentSummary(updatedSummary)
      }

      const updatedSummary = await fetchPaymentSummary({
        classId: selectedClassId ?? "",
        // studentId: selectedStudentId,
        studentId: studentIdForPayment,
      })
      setPaymentSummary(updatedSummary)
    } catch (err: any) {
      setError(err.message)
      dispatch(
        showNotification({
          message: "Failed to add Payment",
          status: 0,
        }),
      )
    } finally {
      setLoading("succeeded")
    }
  }

  const handleDeleteDialogOpen = (id: number) => {
    setDeleteId(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setDeleteId(null)
  }

  const confirmDeletePayment = async () => {
    const studentIdForDelete = searchedStudent?.studentId || selectedStudentId
    // if (deleteId && selectedStudentId) {
    if (deleteId && studentIdForDelete) {
      setLoading("pending")
      setError(null)
      try {
        const message = await deleteStudentPayment(deleteId)
        dispatch(
          showNotification({
            message: message,
            status: 1,
          }),
        )
        handleDeleteDialogClose()
        // Refresh transaction data after deletion
        const fetchedTransactions = await fetchTransactions({
          // studentId: selectedStudentId,
          studentId: studentIdForDelete,
          pageNumber: page,
          pageSize: rowsPerPage,
        })
        setPaymentSummary(fetchSummaryData)
        setTransactions(fetchedTransactions.content)
        setTotalTransactions(fetchedTransactions.totalElements)
        setLoading("succeeded")
      } catch (err: any) {
        setError(err.message)
        dispatch(
          showNotification({
            message: err.message,
            status: 0,
          }),
        )
        setLoading("failed")
      }
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }


  const handleAdvanceToggle = async (isChecked: boolean) => {
    setAdvancePaymentState(prev => ({ ...prev, enabled: isChecked }));

    const studentId = selectedStudentId || searchedStudent?.studentId;

    if (!isChecked) {
      setAmount("")
      setAmountError("")
      return;
    }

    if (isChecked) {
      setAdvancePaymentState(prev => ({ ...prev, loading: true }));
      const response = await fetchTotalRemainingDueAmount(studentId);

      if (response.status === 200) {
        setAdvancePaymentState(prev => ({ ...prev, amount: response.data.data }));
        setAmount("")
        setAmountError("")
      } else {
        setAmountError("Failed to fetch advance amount");
      }
    }
    setAdvancePaymentState(prev => ({ ...prev, loading: false }));
  }

  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>
          Student Payment Details
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="payment tabs"
        >
          <Tab label="Student Dues" />
          <Tab label="Latest Transactions" />
        </Tabs>

        {tabValue === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={pathname === "/studentPayment" ? 6 : 12}>
              {paymentSummary && Object.keys(paymentSummary).length > 0 && (
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.background.paper,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: "22px" }}>
                    Due Summary
                  </Typography>
                  <Divider />
                  <DialogContent>
                    {(() => {
                      const months = Object.keys(paymentSummary)
                      const latestMonth = months[0]
                      const latestSummary = paymentSummary[latestMonth]

                      return (
                        <Box key={latestMonth} sx={{ mb: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {latestMonth}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>Total Due Amount: </Typography>
                            <Typography sx={{ color: "red" }}>
                              ₹{latestSummary?.cumulativeDue?.amount ?? 0}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            fullWidth
                            // onClick={() => setOpenDialog(true)}
                            onClick={handleOpenDialog}
                            disabled={
                              (latestSummary?.cumulativeDue?.amount ?? 0) <= 0
                            }
                          >
                            Pay ₹{latestSummary?.cumulativeDue?.amount ?? 0}
                          </Button>
                        </Box>
                      )
                    })()}
                  </DialogContent>
                </Paper>
              )}
            </Grid>
            {pathname === "/studentPayment" && (
              <Grid item xs={12} md={6}>
                {(selectedStudentId || searchedStudent || profileStudentId) && (
                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      backgroundColor: theme.palette.background.paper,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold", fontSize: "22px" }}>
                      Student Information
                    </Typography>
                    <Divider />
                    <DialogContent>
                      {searchedStudent ||
                        (selectedStudentId &&
                          paymentSummary &&
                          Object.keys(paymentSummary).length > 0) ? (
                        <>
                          <Typography>
                            <b>Name:</b>{" "}
                            {searchedStudent?.studentName || studentName}
                          </Typography>
                          <Typography>
                            <b>Student ID:</b>{" "}
                            {searchedStudent?.studentId || selectedStudentId}
                          </Typography>
                          <Typography>
                            <b>Email:</b> {searchedStudent?.email}
                          </Typography>
                          <Typography>
                            <b>Class:</b>{" "}
                            {paymentSummary &&
                              Object.keys(paymentSummary).length > 0
                              ? Object.keys(paymentSummary)[0]?.split("-")[0]
                              : ""}
                          </Typography>
                          <Typography>
                            <b>Father Name:</b> {searchedStudent?.fatherName}
                          </Typography>
                          <Typography>
                            <b>Mother Name:</b> {searchedStudent?.motherName}
                          </Typography>
                          <Typography>
                            <b>Address:</b> {searchedStudent?.address}
                          </Typography>
                          <Typography>
                            <b>Admission Date:</b>{" "}
                            {searchedStudent?.studentAdmissionDate}
                          </Typography>
                          <Typography>
                            <b>Class Start Date:</b>{" "}
                            {searchedStudent?.classStartDate}
                          </Typography>
                        </>
                      ) : (
                        <Typography>
                          No student information available.
                        </Typography>
                      )}
                    </DialogContent>
                  </Paper>
                )}
              </Grid>
            )}
          </Grid>
        )}

        {paymentSummary && tabValue === 0 && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <DialogTitle sx={{ p: 1, mb: 2 }}>Payment Details</DialogTitle>
            <DialogContent>
              <TableContainer component={Paper}>
                <Table aria-label="payment summary table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "550" }}>
                        Date Range
                      </TableCell>
                      <TableCell sx={{ fontWeight: "550" }}>
                        Class Charge
                      </TableCell>
                      <TableCell sx={{ fontWeight: "550" }}>
                        Additional Charge
                      </TableCell>
                      <TableCell sx={{ fontWeight: "550" }}>Discount</TableCell>
                      <TableCell sx={{ fontWeight: "550" }}>
                        Paid Amount
                      </TableCell>
                      <TableCell sx={{ fontWeight: "550" }}>
                        Cumulative Due Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentSummary &&
                      Object.entries(paymentSummary).map(
                        ([monthYear, summary]: [string, any]) => {
                          const classCharge = summary?.Charge?.total ?? "NA"
                          const additionalCharge =
                            summary?.AdditionalCharge?.total ?? "NA"
                          const paidAmount =
                            summary?.StudentPayment?.total ?? "NA"
                          const cumulativeDue =
                            summary?.cumulativeDue?.amount ?? "NA"

                          return (
                            <TableRow key={monthYear}>
                              <TableCell>{monthYear}</TableCell>
                              <TableCell>
                                {classCharge !== "NA" && (
                                  <AccountSummaryPopOver
                                    id={`class-charge-${monthYear}`}
                                    text={classCharge}
                                    onHoverText={summary?.Charge || {}}
                                  />
                                )}
                                {classCharge === "NA" && "NA"}
                              </TableCell>
                              <TableCell>
                                {additionalCharge !== "NA" && (
                                  <AccountSummaryPopOver
                                    id={`additional-charge-${monthYear}`}
                                    text={additionalCharge}
                                    onHoverText={
                                      summary?.AdditionalCharge || {}
                                    }
                                  />
                                )}
                                {additionalCharge === "NA" && "NA"}
                              </TableCell>
                              <TableCell>NA</TableCell>
                              <TableCell>
                                {paidAmount !== "NA" && (
                                  <AccountSummaryPopOver
                                    id={`paid-amount-${monthYear}`}
                                    text={paidAmount}
                                    onHoverText={summary?.StudentPayment || {}}
                                  />
                                )}
                                {paidAmount === "NA" && "NA"}
                              </TableCell>
                              <TableCell>
                                <Button variant="contained" color="warning">
                                  ₹{cumulativeDue}
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        },
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
          </Paper>
        )}

        {tabValue === 1 &&
          (selectedStudentId || searchedStudent || profileStudentId) && (
            <Paper sx={{ p: 2, mt: 2 }}>
              <DialogTitle>Latest Transactions</DialogTitle>
              <DialogContent>
                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                  <Table aria-label="latest transactions table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Receipt ID</TableCell>
                        <TableCell>Payment Mode</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Payment Date</TableCell>
                        {userRole === roles.admin[0] && (
                          <TableCell>Action</TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map(transaction => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.receiptId}</TableCell>
                          <TableCell>{transaction.paymentMode}</TableCell>
                          <TableCell>{transaction.paidAmount}</TableCell>
                          <TableCell>{transaction.paymentDate}</TableCell>
                          {userRole === roles.admin[0] && (
                            <TableCell>
                              <IconButton
                                onClick={() =>
                                  handleDeleteDialogOpen(transaction.id)
                                }
                              >
                                <Delete sx={{ color: "red" }} />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
            </Paper>
          )}
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Add Student Payment for {paymentDialogStudentName}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ m: 2 }}>
            Enter the new payment info below.
          </Typography>

          {/* Amount */}
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            // onChange={e => setAmount(e.target.value)}
            onChange={handleAmountChange}
            error={!!amountError}
            sx={{ mb: 2 }}
          />
          {amountError && <FormHelperText error>{amountError}</FormHelperText>}

          <FormControlLabel
            control={
              <Switch
                checked={advancePaymentState.enabled}
                onChange={(e) => handleAdvanceToggle(e.target.checked)}
              />
            }
            label="Advance Payment"
          />

          {!advancePaymentState.enabled &&
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              You can pay the yearly fees in advance using this option.
            </Typography>
          }

          {advancePaymentState.enabled &&
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
             Yearly Due Amount : ₹{advancePaymentState.amount}
            </Typography>
          }

          <Select
            fullWidth
            value={selectedMode}
            onChange={e => setSelectedMode(e.target.value)}
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>
              Select Payment Mode
            </MenuItem>
            {paymentModes.map((mode, index) => (
              <MenuItem key={index} value={mode}>
                {mode}
              </MenuItem>
            ))}
          </Select>

          {selectedMode === "UPI" && (
            <TextField
              label="UPI ID"
              fullWidth
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          {/* Currency */}
          <TextField
            label="Currency Number"
            type="number"
            fullWidth
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />

          {/* Remark */}
          <TextField
            label="Remark"
            fullWidth
            multiline
            value={remark}
            onChange={e => setRemark(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2,
            }}
          >
            <Button onClick={() => setOpenDialog(false)} variant="outlined">
              Close
            </Button>
            {/* <Button onClick={handleSubmit} variant="contained" color="primary">
              {loading === "pending" ? "Processing..." : "Add Payment"}
            </Button> */}
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={isSubmitting || loading === "pending" || !!amountError}
            >
              {loading === "pending" || isSubmitting
                ? "Processing..."
                : "Add Payment"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogOpen}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this payment record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={confirmDeletePayment}
            color="error"
            variant="contained"
          >
            {loading === "pending" ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PaymentGrid
