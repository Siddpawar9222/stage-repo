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
import { closeModal, openModal } from "../../../app/reducers/modalSlice";
import { createStudent, getStudentDetailsByStudentId, updateStudent } from "../../../services/apis/dms/studentService";
import { MODAL_CONSTANTS } from "../../../utils/modalUtils";
import { useRole } from "../../../RoleContext";
import { roles } from "../../../utils/roles";
import { registerUser } from "../../../services/apis/user/authUser";

interface StudentModalProps {
  isOpen: boolean;
  extraObject: {
    studentId?: string;
    isAdd: string;
    classId: string;
    onSuccess: () => void;
  };
}

interface StudentFormData {
  studentName: string;
  email: string;
  contactNumber: string;
  address: string;
  fatherName: string;
  motherName: string;
  parentContactNumber : string ;
  dob: string;
  admissionNumber: string;
  studentAdmissionDate: string;
  classStartDate: string;
}

const AddOrEditStudent: React.FC<StudentModalProps> = ({ isOpen, extraObject }) => {
  const studentId = extraObject?.studentId;
  const classId = extraObject?.classId;
  const isAdd = extraObject?.isAdd == MODAL_CONSTANTS.ADD_STUDENT;
  const onSuccess = extraObject?.onSuccess;

  const dispatch = useDispatch();
  const { userRole } = useRole();
  const [formData, setFormData] = useState<StudentFormData>({
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const addStudent = async (data: object) => {
    const response = await createStudent({ ...data, classId: classId });
    if (response?.status !== 201) {
      dispatch(openModal({ title: response?.statusText, bodyType: MODAL_CONSTANTS.ERROR }));
    } else {
       const studentSavedData = response?.data?.data ;
       await registerUser(studentSavedData);   
      dispatch(showNotification({ message: "Student added successfully!", status: 1 }));
      return true;
    }
  };

  const fetchStudentDetailsByStudentId = async (studentId: any) => {
    const response = await getStudentDetailsByStudentId(studentId);
    if (response?.status === 200) {
      const studentData = response?.data?.data;
      setFormData({ 
        studentName: studentData?.studentName,
        email: studentData?.email,
        contactNumber: studentData?.contactNumber,
        address: studentData?.address,
        fatherName: studentData?.fatherName,
        motherName: studentData?.motherName,
        parentContactNumber: studentData?.parentContactNumber,
        dob: studentData?.dob,
        admissionNumber: studentData?.admissionNumber,
        studentAdmissionDate: studentData?.studentAdmissionDate,
        classStartDate: studentData?.classStartDate
      })
    } else {
      dispatch(openModal({ title: response?.statusText, bodyType: MODAL_CONSTANTS.ERROR }));
    }
  };


  const editStudent = async (studentId: any, data: object) => {
    const response = await updateStudent(studentId, { ...data, classId: classId });
    if (response?.status !== 200) {
        dispatch(openModal({ title: response?.statusText, bodyType: MODAL_CONSTANTS.ERROR }));
    } else {
      dispatch(showNotification({ message: "Student updated successfully!", status: 1 }));
      return true;
    }
  };

  useEffect(() => {
    if (!isAdd && studentId) {
      fetchStudentDetailsByStudentId(studentId);
    }
  }, [isAdd, studentId]);

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.studentName) newErrors.studentName = "Name is required";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.contactNumber || !/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = "Must be a valid 10-digit number";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.fatherName) newErrors.fatherName = "Father Name is required";
    if (!formData.motherName) newErrors.motherName = "Mother Name is required";
    if (!formData.parentContactNumber || !/^\d{10}$/.test(formData.parentContactNumber)) newErrors.parentContactNumber = "Must be a valid 10-digit number";
    if (!formData.dob) newErrors.dob = "DOB is required";
    if (!formData.admissionNumber) newErrors.admissionNumber = "Admission number is required";
    if (!formData.studentAdmissionDate) newErrors.studentAdmissionDate = "Student Admission Date is required";
    if (!formData.classStartDate) newErrors.classStartDate = "Class Start Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true); 
      const result = isAdd ? await addStudent(formData) : await editStudent(studentId, formData);
      setLoading(false);
      if (result) {
        handleOnClose();
        onSuccess();
      }
    }
  };

  const handleOnClose = () => {
    dispatch(closeModal());
  };

  return (
    <Dialog open={isOpen} fullWidth>
      <DialogTitle>{isAdd ? "Add Student" : `Edit ${formData.studentName}`}</DialogTitle>
      <DialogContent style={{ paddingTop: 16 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField name="studentName" label="Name" fullWidth value={formData.studentName} onChange={handleChange} error={!!errors.studentName} helperText={errors.studentName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="email" label="Email" fullWidth value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="contactNumber" label="Contact Number" fullWidth value={formData.contactNumber} onChange={handleChange} error={!!errors.contactNumber} helperText={errors.contactNumber} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="address" label="Address" fullWidth value={formData.address} onChange={handleChange} error={!!errors.address} helperText={errors.address} disabled = {
              !isAdd &&
              userRole === roles.teacher[0]
            }/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="fatherName" label="Father Name" fullWidth value={formData.fatherName} onChange={handleChange} error={!!errors.fatherName} helperText={errors.fatherName} disabled = {
              !isAdd &&
              userRole === roles.teacher[0]
            }/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="motherName" label="Mother Name" fullWidth value={formData.motherName} onChange={handleChange} error={!!errors.motherName} helperText={errors.motherName} disabled = {
              !isAdd &&
              userRole === roles.teacher[0]
            }/>
          </Grid>
           
          <Grid item xs={12} sm={6}>
            <TextField name="parentContactNumber" label="Parent Contact Number" fullWidth value={formData.parentContactNumber} onChange={handleChange} error={!!errors.parentContactNumber} helperText={errors.parentContactNumber} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField name="dob" label="DOB" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.dob} onChange={handleChange} error={!!errors.dob} helperText={errors.dob} disabled = {
              !isAdd &&
              userRole === roles.teacher[0]
            }/>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField name="admissionNumber" label="Admission Number" fullWidth value={formData.admissionNumber} onChange={handleChange} error={!!errors.admissionNumber} helperText={errors.admissionNumber} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField name="studentAdmissionDate" label="Student Admission Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.studentAdmissionDate} onChange={handleChange} error={!!errors.studentAdmissionDate} helperText={errors.studentAdmissionDate} disabled = {
              !isAdd &&
              (userRole === roles.teacher[0] || 
              userRole === roles.operator[0])
            }/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="classStartDate" label="Class Start Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.classStartDate} onChange={handleChange} error={!!errors.classStartDate} helperText={errors.classStartDate} disabled = {
              !isAdd &&
              (userRole === roles.teacher[0] || 
              userRole === roles.operator[0])
            } />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose} variant="outlined" color="error">Close</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>{isAdd ? "Add" : "Submit"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrEditStudent;
