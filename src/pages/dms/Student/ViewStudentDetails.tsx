import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { getStudentDetailsByStudentId } from "../../../services/apis/dms/studentService";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../app/reducers/modalSlice";

interface ViewStudentDetailsProps {
  isOpen: boolean;
  extraObject: {
    studentId: string;
  };
}

interface StudentData {
  studentName: string;
  email: string;
  contactNumber: string;
  address: string;
  fatherName: string;
  motherName: string;
  parentContactNumber: string;
  dob: string;
  admissionNumber: string;
  studentAdmissionDate: string;
  classStartDate: string;
}

const ViewStudentDetails: React.FC<ViewStudentDetailsProps> = ({ isOpen, extraObject }) => {
  const studentId = extraObject?.studentId;
  const dispatch = useDispatch();
  const [studentData, setStudentData] = useState<StudentData>({
    studentName: "",
    email: "",
    contactNumber: "",
    address: "",
    fatherName: "",
    motherName: "",
    parentContactNumber: "",
    dob: "",
    admissionNumber: "",
    studentAdmissionDate: "",
    classStartDate: "",
  });

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (studentId) {
        const response = await getStudentDetailsByStudentId(studentId);
        if (response?.status === 200) {
          setStudentData(response.data.data);
        } else {
          dispatch(closeModal());
        }
      }
    };
    
    if (isOpen) {
      fetchStudentDetails();
    }
  }, [isOpen, studentId, dispatch]);

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <Dialog open={isOpen} fullWidth>
    <DialogTitle>Student Details</DialogTitle>
    <DialogContent style={{ paddingTop: 16 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField name="studentName" label="Name" fullWidth value={studentData.studentName} disabled InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="email" label="Email" fullWidth value={studentData.email} disabled InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="contactNumber" label="Contact Number" fullWidth value={studentData.contactNumber} disabled InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="address" label="Address" fullWidth value={studentData.address} disabled InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="fatherName" label="Father Name" fullWidth value={studentData.fatherName} disabled InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="motherName" label="Mother Name" fullWidth value={studentData.motherName} disabled InputLabelProps={{ shrink: true }} />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField name="parentContactNumber" label="Parent Contact Number" fullWidth value={studentData.parentContactNumber} disabled InputLabelProps={{ shrink: true }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField name="dob" label="DOB" type="date" fullWidth InputLabelProps={{ shrink: true }} value={studentData.dob} disabled />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="admissionNumber" label="Student Admission Number" type="text" fullWidth InputLabelProps={{ shrink: true }} value={studentData.admissionNumber} disabled />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField name="studentAdmissionDate" label="Student Admission Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={studentData.studentAdmissionDate} disabled />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField name="classStartDate" label="Class Start Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={studentData.classStartDate} disabled />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} variant="outlined" color="error">Close</Button>
    </DialogActions>
  </Dialog>
  );
};

export default ViewStudentDetails;
