import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { showNotification } from "../../../app/reducers/headerSlice"
import {
  addBulkSubject as addBulkSubjectApi,
  SubjectItem,
} from "../../../services/apis/dms/subjectService"

interface BulkSubjectModalProps {
  isOpen: boolean
  classId: string | null
  className?: string
  onSuccess: () => void
  onClose: () => void
}

const AddBulkSubject: React.FC<BulkSubjectModalProps> = ({
  isOpen,
  classId,
  className,
  onSuccess,
  onClose,
}) => {
  const dispatch = useDispatch()
  const [subjectNames, setSubjectNames] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setSubjectNames("")
      setErrors({})
    }
  }, [isOpen])

  const handleAddBulkSubjects = async () => {
    setLoading(true)
    try {
      const namesArray = subjectNames
        .split(",")
        .map(name => name.trim())
        .filter(name => name !== "")
      const subjectsToAdd = namesArray.map(name => ({
        classId: classId || "",
        subjectName: name,
        bookName: " ",
        subjectDescription: " ",
      }))

      if (subjectsToAdd.length > 0) {
        await addBulkSubjectApi(subjectsToAdd)
        dispatch(
          showNotification({
            message: "Subjects added successfully!",
            status: 1,
          }),
        )
        onSuccess()
        onClose()
      } else {
        dispatch(
          showNotification({
            message: "Please enter at least one subject name.",
            status: 0,
          }),
        )
      }
    } catch (error: any) {
      dispatch(showNotification({ message: error.message, status: 0 }))
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    let newErrors: Record<string, string> = {}
    if (!subjectNames.trim()) {
      newErrors.subjectNames = "Please enter subject names."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectNames(e.target.value)
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true)
      await handleAddBulkSubjects()
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} fullWidth>
      <DialogTitle>Add Bulk Subjects</DialogTitle>
      <DialogContent style={{ paddingTop: 16 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Class"
              fullWidth
              value={className || ""}
              disabled
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="subjectNames"
              label="Subject Names (comma-separated)"
              fullWidth
              multiline
              rows={4}
              value={subjectNames}
              onChange={handleChange}
              error={!!errors.subjectNames}
              helperText={errors.subjectNames}
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="error">
          Close
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddBulkSubject
