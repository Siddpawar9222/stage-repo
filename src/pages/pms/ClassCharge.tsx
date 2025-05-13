import React, { useState, useEffect, ChangeEvent } from "react"
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Collapse,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  SelectChangeEvent,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material"
import {
  Add,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material"
import { useRole } from "../../RoleContext"
import { roles } from "../../utils/roles"
import {
  fetchChargesGroupByMonth,
  fetchLedgerHeads,
  ChargeItem,
  MonthlyCharges,
  addCharge,
  updateCharge,
  deleteCharge,
} from "../../services/apis/pms/chargeService"
import { fetchClasses, ClassItem } from "../../services/apis/dms/classService"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../../app/reducers/modalSlice"
import PageTitle from "../../components/PageTitle"
import { showNotification } from "../../app/reducers/headerSlice"

const ClassCharge: React.FC = () => {
  const [monthlyCharges, setMonthlyCharges] = useState<MonthlyCharges | null>(
    null,
  )
  const [ledgerHeads, setLedgerHeads] = useState<ChargeItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [chargeData, setChargeData] = useState<
    { month: string; charges: ChargeItem[] }[]
  >([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null)
  const [className, setClassName] = useState<string>("")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [newCharge, setNewCharge] = useState<
    Omit<ChargeItem, "id" | "chargeId">
  >({
    chargeName: "",
    chargeAmount: 0,
    dueDate: "",
    ledgerHeadId: "",
    classId: "",
    ledgerHeadName: "",
  })
  const [editCharge, setEditCharge] = useState<ChargeItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [chargeToDeleteId, setChargeToDeleteId] = useState<number | null>(null)
  const [classes, setClasses] = useState<ClassItem[]>([])
  const theme = useTheme()
  const { userRole } = useRole()

  const resetNewCharge = (): Omit<ChargeItem, "id" | "chargeId"> => ({
    chargeName: "",
    chargeAmount: 0,
    dueDate: "",
    ledgerHeadId: "",
    classId: "",
    ledgerHeadName: "",
  })

  const convertToNumber = (value: string | number): number => {
    return typeof value === "string" ? Number(value) : value
  }
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle("Class Charges"))

    const fetchData = async () => {
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
    fetchData()
  }, [])

  useEffect(() => {
    const fetchChargeData = async () => {
      if (selectedClassId) {
        setLoading(true)
        setError(null)
        try {
          const fetchedCharges = await fetchChargesGroupByMonth(selectedClassId)
          setMonthlyCharges(fetchedCharges)
          const nameParts = selectedClassId.split("_")
          const extractedClassName = nameParts
            .slice(nameParts.length - 1)
            .join(" ")
          setClassName(extractedClassName)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      } else {
        setClassName("")
      }
    }
    fetchChargeData()
  }, [selectedClassId])

  const handleClassSelect = (event: SelectChangeEvent<string>) => {
    const selectedClassId = event.target.value
    setSelectedClassId(selectedClassId)
    const selectedClass =
      classes?.find(cls => cls.classId === selectedClassId) ?? null
    setClassName(selectedClass ? selectedClass.className : "")
  }

  useEffect(() => {
    if (monthlyCharges) {
      const formattedCharges = Object.entries(monthlyCharges).map(
        ([month, charges]) => ({
          month,
          charges,
        }),
      )
      setChargeData(formattedCharges)
    }
  }, [monthlyCharges])

  useEffect(() => {
    if (chargeData.length > 0) {
      const total = chargeData.reduce((acc, item) => {
        return (
          acc +
          item.charges.reduce((sum, charge) => sum + charge.chargeAmount, 0)
        )
      }, 0)
      setTotalAmount(total)
    }
  }, [chargeData])

  const handleMonthClick = (month: string) => {
    setExpandedMonth(expandedMonth === month ? null : month)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>,
  ): void => {
    let name: string = ""
    let value: any
    if (e.target) {
      name = e.target.name
      value = e.target.value
      if (e.target instanceof HTMLInputElement && e.target.type === "number") {
        value = Number(e.target.value)
      }
    }
    setNewCharge(prev => ({ ...prev, [name]: value }))
  }

  const handleAddCharge = async (): Promise<void> => {
    try {
      if (!selectedClassId) {
        console.error("No class selected")
        return
      }
      const selectedLedgerHead = ledgerHeads.find(
        head => head.ledgerHeadId === newCharge.ledgerHeadId,
      )
      if (!selectedLedgerHead) {
        console.error("Ledger head not found")
        return
      }
      await addCharge({
        chargeAmount: convertToNumber(newCharge.chargeAmount),
        dueDate: newCharge.dueDate,
        classId: selectedClassId,
        ledgerHeadId: newCharge.ledgerHeadId,
        chargeName:
          ledgerHeads.find(head => head.ledgerHeadId === newCharge.ledgerHeadId)
            ?.ledgerHeadName || "",
      })
      dispatch(
              showNotification({
                message: "Charge added successfully",
                status: 1, // 1 for success
              }),
            )
      const updatedCharges = await fetchChargesGroupByMonth(selectedClassId)
      setMonthlyCharges(updatedCharges)
      handleAddDialogClose()
      dispatch(
        showNotification({
          message: "Charge added successfully",
          status: 1, // 1 for success
        }),
      )
      setNewCharge(resetNewCharge())
    } catch (error: any) {
      console.error("Error creating charge:", error)
      dispatch(
        showNotification({
          message: "Failed to add Charge",
          status: 0, // 1 for error
        }),
      )
    }
  }

  const handleUpdateCharge = async (): Promise<void> => {
    try {
      if (!editCharge) return
      await updateCharge({
        id: editCharge.id,
        chargeAmount: convertToNumber(newCharge.chargeAmount),
        dueDate: newCharge.dueDate,
        ledgerHeadId: newCharge.ledgerHeadId,
        chargeName: newCharge.chargeName,
        classId: newCharge.classId,
        chargeId: "",
        ledgerHeadName: "",
      })
      if (selectedClassId) {
        const updatedCharges = await fetchChargesGroupByMonth(selectedClassId)
        setMonthlyCharges(updatedCharges)
      }
      dispatch(
        showNotification({
          message: "Charge updated successfully",
          status: 1, // 1 for success
        }),
      )
      handleEditDialogClose()
      setNewCharge(resetNewCharge())
      setEditCharge(null)
    } catch (error: any) {
      console.error("Error updating charge:", error)
      dispatch(
        showNotification({
          message: "Failed to update Charge",
          status: 0, // 1 for success
        }),
      )
    }
  }

  const handleDeleteCharge = async (chargeId: number): Promise<void> => {
    try {
      if (!selectedClassId) {
        console.error("No class selected")
        return
      }
      await deleteCharge(chargeId)
      const updatedCharges = await fetchChargesGroupByMonth(selectedClassId)
      dispatch(
        showNotification({
          message: "Charge deleted successfully",
          status: 1, // 1 for success
        }),
      )
      setMonthlyCharges(updatedCharges)
    } catch (error: any) {
      console.error("Error deleting charge:", error)
      dispatch(
        showNotification({
          message: "Failed to delete Charge",
          status: 0, // 1 for success
        }),
      )
    }
  }

  const handleDeleteDialogOpen = (chargeId: number): void => {
    setChargeToDeleteId(chargeId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = (): void => {
    setDeleteDialogOpen(false)
    setChargeToDeleteId(null)
  }

  const handleConfirmDelete = async (): Promise<void> => {
    if (chargeToDeleteId !== null) {
      await handleDeleteCharge(chargeToDeleteId)
      setDeleteDialogOpen(false)
      setChargeToDeleteId(null)
    }
  }

  const handleTextFieldChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    const newValue = name === "chargeAmount" ? Number(value) : value
    setNewCharge(prev => ({ ...prev, [name]: newValue }))
  }

  const handleSelectChange = (e: SelectChangeEvent<string>): void => {
    const { name, value } = e.target
    setNewCharge(prev => ({ ...prev, [name]: value }))
  }

  const handleAddDialogOpen = async (): Promise<void> => {
    setAddDialogOpen(true)
    setLoading(true)
    setError(null)
    try {
      const fetchedLedgerHeads = await fetchLedgerHeads()
      setLedgerHeads(fetchedLedgerHeads)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
    setNewCharge(resetNewCharge())
  }

  const handleAddDialogClose = (): void => {
    setAddDialogOpen(false)
    setEditCharge(null)
    setNewCharge(resetNewCharge())
  }

  const handleEditDialogOpen = async (charge: ChargeItem): Promise<void> => {
    setEditDialogOpen(true)
    setEditCharge(charge)
    setNewCharge({
      chargeAmount: charge.chargeAmount,
      dueDate: charge.dueDate,
      ledgerHeadId: charge.ledgerHeadId,
      chargeName: charge.chargeName,
      classId: charge.classId,
      ledgerHeadName: charge.ledgerHeadName,
    })
    setLoading(true)
    setError(null)
    try {
      const fetchedLedgerHeads = await fetchLedgerHeads()
      setLedgerHeads(fetchedLedgerHeads)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditDialogClose = (): void => {
    setEditDialogOpen(false)
    setEditCharge(null)
    setNewCharge(resetNewCharge())
  }

  if (loading) {
    return <p>Loading charges...</p>
  }

  if (error) {
    return <p>Error loading charges: {error}</p>
  }

  return (
    <>
      <PageTitle />
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
              sx={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "16px",
              }}
            >
              {userRole === roles.admin[0] && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddDialogOpen}
                  disabled={loading}
                >
                  <Add />
                  Add Charge
                </Button>
              )}
            </Box>
            <Box
              sx={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "12px",
                borderRadius: "4px",
                background: theme.palette.background.paper,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "1.2rem", fontWeight: "500" }}
                gutterBottom
              >
                {className ? `${className} Charges` : "Select a Class"}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "500" }}
                gutterBottom
              >
                Total Amount: ₹{totalAmount}
              </Typography>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Month</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Total Monthly Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chargeData.map(item => (
                    <React.Fragment key={item.month}>
                      <TableRow onClick={() => handleMonthClick(item.month)}>
                        <TableCell>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            {expandedMonth === item.month ? (
                              <ExpandLessIcon
                                sx={{ verticalAlign: "middle" }}
                              />
                            ) : (
                              <ExpandMoreIcon
                                sx={{ verticalAlign: "middle" }}
                              />
                            )}
                            {item.month}
                          </Box>
                        </TableCell>
                        <TableCell>
                          ₹
                          {item.charges.reduce(
                            (sum, charge) => sum + charge.chargeAmount,
                            0,
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={2}
                        >
                          <Collapse
                            in={expandedMonth === item.month}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ margin: 1 }}>
                              <Table size="small" aria-label="charges">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                      Charge Name
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                      Due Date
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                      Amount
                                    </TableCell>
                                    {userRole === roles.admin[0] && (
                                      <TableCell sx={{ fontWeight: "bold" }}>
                                        Action
                                      </TableCell>
                                    )}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {item.charges.map(charge => (
                                    <TableRow key={charge.id}>
                                      <TableCell>{charge.chargeName}</TableCell>
                                      <TableCell>
                                        {new Date(
                                          charge.dueDate,
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}
                                      </TableCell>
                                      <TableCell>
                                        ₹{charge.chargeAmount}
                                      </TableCell>
                                      {userRole === roles.admin[0] && (
                                        <TableCell>
                                          <IconButton
                                            aria-label="edit"
                                            onClick={() =>
                                              handleEditDialogOpen(charge)
                                            }
                                          >
                                            <EditIcon
                                              sx={{ color: "yellow" }}
                                            />
                                          </IconButton>
                                          <IconButton
                                            aria-label="delete"
                                            onClick={() =>
                                              //   handleDeleteCharge(charge.id)
                                              handleDeleteDialogOpen(charge.id)
                                            }
                                          >
                                            <DeleteIcon sx={{ color: "red" }} />
                                          </IconButton>
                                        </TableCell>
                                      )}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Dialog
              open={addDialogOpen || editDialogOpen}
              onClose={
                addDialogOpen ? handleAddDialogClose : handleEditDialogClose
              }
              PaperProps={{
                style: { backgroundColor: theme.palette.background.paper },
              }}
            >
              <DialogTitle
                style={{
                  color: "black",
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                {addDialogOpen ? "Add New Charge" : "Edit Charge"} for{" "}
                {className}
              </DialogTitle>
              <DialogContent style={{ paddingTop: 16 }}>
                <FormControl fullWidth>
                  <InputLabel id="ledgerHeadId">Ledger Head</InputLabel>
                  <Select
                    labelId="ledgerHeadId-label"
                    id="ledgerHeadId"
                    name="ledgerHeadId"
                    value={newCharge.ledgerHeadId}
                    label="Ledger Head"
                    onChange={handleSelectChange}
                    disabled={!!editCharge}
                  >
                    {ledgerHeads &&
                      ledgerHeads.map((head: ChargeItem) => (
                        <MenuItem
                          key={head.ledgerHeadId}
                          value={head.ledgerHeadId}
                        >
                          {head.ledgerHeadName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  id="chargeAmount"
                  name="chargeAmount"
                  label="Charge Amount"
                  type="number"
                  fullWidth
                  value={String(newCharge.chargeAmount)}
                  onChange={handleTextFieldChange}
                />
                <TextField
                  margin="dense"
                  id="dueDate"
                  name="dueDate"
                  label="Due Date"
                  type="date"
                  fullWidth
                  value={newCharge.dueDate}
                  onChange={handleTextFieldChange}
                  InputLabelProps={{ shrink: true }}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={
                    addDialogOpen ? handleAddDialogClose : handleEditDialogClose
                  }
                >
                  Cancel
                </Button>
                <Button
                  onClick={addDialogOpen ? handleAddCharge : handleUpdateCharge}
                  color="primary"
                  variant="contained"
                >
                  {addDialogOpen ? "Add" : "Update"}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <Typography>
              Are you sure you want to delete this charge?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default ClassCharge
