import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { useDispatch } from "react-redux";
  import { showNotification } from "../../../app/reducers/headerSlice";
  import {
    addBulkChapter,
    ChapterItem,
  } from "../../../services/apis/dms/chapterService";
  
  interface ChapterModalProps {
    isOpen: boolean;
    classId: string;
    className?: string;
    subjectId: string;
    subjectName?: string;
    onSuccess: () => void;
    onClose: () => void;
  }
  
  const AddBulkChapter: React.FC<ChapterModalProps> = ({
    isOpen,
    classId,
    className,
    subjectId,
    subjectName,
    onSuccess,
    onClose,
  }) => {
    const dispatch = useDispatch();
    const [chapterNames, setChapterNames] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (isOpen) {
        setChapterNames("");
        setErrors({});
      }
    }, [isOpen]);
  
    const handleAddBulkChapters = async () => {
        setLoading(true);
        try {
          const namesArray = chapterNames.split(",").map((name) => name.trim()).filter(name => name !== "");
          const chaptersToAdd = namesArray.map((name) => ({
            chapterId: `tech_eazy_lms_${name.replace(/\s+/g, ' ')}`, // Basic chapter ID generation
            chapterName: name,
            videoId: " ",
            subjectId: subjectId,
            classId: classId,
          }));
    
          if (chaptersToAdd.length > 0) {
            // Assuming addBulkChapter correctly handles an array
            await addBulkChapter(chaptersToAdd);
            dispatch(showNotification({ message: "Chapters added successfully!", status: 1 }));
            onSuccess();
            onClose();
          } else {
            dispatch(showNotification({ message: "Please enter at least one chapter name.", status: 0 }));
          }
        } catch (error: any) {
          dispatch(showNotification({ message: error.message, status: 0 }));
        } finally {
          setLoading(false);
        }
      };
  
    const validateForm = () => {
      let newErrors: Record<string, string> = {};
      if (!chapterNames.trim()) {
        newErrors.chapterNames = "Please enter chapter names.";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setChapterNames(e.target.value);
    };
  
    const handleSubmit = async () => {
      if (validateForm()) {
        setLoading(true);
        await handleAddBulkChapters();
        setLoading(false);
      }
    };
  
    return (
      <Dialog open={isOpen} fullWidth>
        <DialogTitle>Add Bulk Chapters</DialogTitle>
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
              label="Subject"
              fullWidth
              value={subjectName || ""}
              disabled
              margin="dense"
            />
          </Grid>
            <Grid item xs={12}>
              <TextField
                name="chapterNames"
                label="Chapter Names (comma-separated)"
                fullWidth
                multiline
                rows={4}
                value={chapterNames}
                onChange={handleChange}
                error={!!errors.chapterNames}
                helperText={errors.chapterNames}
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
    );
  };
  
  export default AddBulkChapter;