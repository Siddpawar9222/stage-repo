import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
  useTheme,
} from "@mui/material";
import ChapterGrid from "./ChapterGrid";
import {
  ClassItem,
  fetchClasses,
} from "../../../services/apis/dms/classService"
import {
  SubjectItem,
  fetchSubjectsByClass,
} from "../../../services/apis/dms/subjectService"; // Assuming correct path
import { setPageTitle } from "../../../app/reducers/modalSlice";
import PageTitle from "../../../components/PageTitle";

const Chapter: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(
    null
  );

  useEffect(() => {
    dispatch(setPageTitle("Class Chapters"));
    const fetchAllClasses = async () => {
      setLoading(true);
      try {
        const data = await fetchClasses();
        setClasses(data);
      } catch (err: any) {
        console.error("Error fetching classes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllClasses();
  }, [dispatch]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedClass) {
        try {
          const data = await fetchSubjectsByClass(selectedClass.classId);
          setSubjects(data);
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      } else {
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [selectedClass]);

  const handleClassChange = (event: SelectChangeEvent<string>) => {
    const selectedClassObj =
      classes.find((cls) => cls.classId === event.target.value) || null;
    setSelectedClass(selectedClassObj);
    setSelectedSubject(null);
  };

  const handleSubjectChange = (event: SelectChangeEvent<string>) => {
    const selectedSubjectObj =
      subjects.find((sub) => sub.id?.toString() === event.target.value) || null;
    setSelectedSubject(selectedSubjectObj);
  };

  return (
    <>
      <PageTitle />
      <Box
        sx={{ margin: "20px auto", maxWidth: "1200px" }}
      >
        <h2>Select a Class</h2>
        <Box sx={{ display: "flex", gap: 2, marginTop: "20px" }}>
          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel id="class-select-label">Class</InputLabel>
            <Select
              labelId="class-select-label"
              id="class-select"
              value={selectedClass?.classId || ""}
              label="Class"
              onChange={handleClassChange}
            >
              {classes.map((item) => (
                <MenuItem key={item.id} value={item.classId}>
                  {item.className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
            <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel id="subject-select-label">Subject</InputLabel>
            <Select
              labelId="subject-select-label"
              id="subject-select"
              value={selectedSubject?.id?.toString() || ""}
              label="Subject"
              onChange={handleSubjectChange}
              disabled={!selectedClass}
            >
              {subjects.map((item) => (
                <MenuItem key={item.id} value={item.id?.toString()}>
                  {item.subjectName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      {selectedSubject && selectedClass && (
        <>
        {console.log("Chapter Component Values:", selectedClass.classId, selectedSubject.id)}
        <ChapterGrid
          classId={selectedClass.classId}
          subjectId={selectedSubject.subjectId?.toString() || ""}
        />
        </>
      )}
    </>
  );
};

export default Chapter;