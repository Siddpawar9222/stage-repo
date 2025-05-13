import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { showNotification } from "../../../app/reducers/headerSlice"
import {
  ChapterItem,
  createChapter,
  updateChapter,
} from "../../../services/apis/dms/chapterService" // Import chapter service

interface ChapterModalProps {
  isOpen: boolean;
  chapter?: ChapterItem;
  classId: string;
  subjectId: string;
  onSuccess: () => void;
  onClose: () => void;
}

const AddEditChapter: React.FC<ChapterModalProps> = ({
  isOpen,
  chapter,
  classId,
  subjectId,
  onSuccess,
  onClose,
}) => {
  const dispatch = useDispatch();
  const isAdd = !chapter;
  const [formData, setFormData] = useState<ChapterItem>({
    chapterName: "",
    videoId: " ",
    classId: classId,
    subjectId: subjectId,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (chapter) {
        setFormData({ ...chapter });
      } else {
        setFormData({
          chapterName: "",
          videoId: " ",
          classId: classId,
          subjectId: subjectId,
        });
      }
    }
  }, [isOpen, chapter, classId, subjectId]);

  const handleAddChapter = async () => {
    setLoading(true);
    try {
      await createChapter(formData);
      dispatch(showNotification({ message: "Chapter added successfully!", status: 1 }));
      onSuccess();
      onClose();
    } catch (error: any) {
      dispatch(showNotification({ message: error.message, status: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const handleEditChapter = async () => {
    setLoading(true);
    try {
      if(formData.id){
        await updateChapter(formData.id, formData);
      }      
      dispatch(showNotification({ message: "Chapter updated successfully!", status: 1 }));
      onSuccess();
      onClose();
    } catch (error: any) {
      dispatch(showNotification({ message: error.message, status: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.chapterName) newErrors.chapterName = "Chapter Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      if (isAdd) {
        await handleAddChapter();
      } else {
        await handleEditChapter();
      }
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} fullWidth>
      <DialogTitle>
        {isAdd ? "Add Chapter" : `Edit ${formData.chapterName}`}
      </DialogTitle>
      <DialogContent style={{ paddingTop: 16 }}>
        <Grid container spacing={2}>
          {/* <Grid item xs={12}>
            <FormControl fullWidth disabled>
              <InputLabel id="class-select-label">Class</InputLabel>
              <Select
                labelId="class-select-label"
                id="class-select"
                value={formData.classId}
                label="Class"
              >
                <MenuItem value={formData.classId}>{formData.classId}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth disabled>
              <InputLabel id="subject-select-label">Subject</InputLabel>
              <Select
                labelId="subject-select-label"
                id="subject-select"
                value={formData.subjectId}
                label="Subject"
              >
                <MenuItem value={formData.subjectId}>
                  {formData.subjectId}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item xs={12}>
            <TextField
              name="chapterName"
              label="Chapter Name"
              fullWidth
              value={formData.chapterName}
              onChange={handleChange}
              error={!!errors.chapterName}
              helperText={errors.chapterName}
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
          {isAdd ? "Add" : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEditChapter;
