import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { Navigate } from 'react-router-dom';
import { fetchStudentByEmail, updateStudent } from '../../../features/dms/profileSlice';
import {
    TextField,
    Button,
    Container,
    Typography,
    CircularProgress,
    Alert,
    Grid,
} from '@mui/material';
import { UnknownAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

interface Student {
    id: number;
    studentId: string;
    studentName: string;
    email: string;
    contactNumber: string;
    classId: string
    fatherName: string;
    motherName: string;
    dob: string;
    address: string;
    parentContactNumber:string;
    studentAdmissionDate: string;
    classStartDate: string;
}

const Profile: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    if (!user?.roles.includes('STUDENT')) return <Navigate to="/dashboard" />;

    const dispatch = useDispatch<ThunkDispatch<RootState, any, UnknownAction>>();
    const { student, loading, error } = useSelector((state: RootState) => state.profile);
    const [isEditing, setIsEditing] = useState(false);
    const [editedStudent, setEditedStudent] = useState<Student | null>(null);

    useEffect(() => {
      dispatch(fetchStudentByEmail()); 
    }, [dispatch]);

    useEffect(() => {
        if (student) {
            setEditedStudent({ ...student });
        }
    }, [student]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        if (student) {
            setEditedStudent({ ...student });
        }
    };

    const handleSaveClick = () => {
        if (editedStudent) {
            dispatch(updateStudent(editedStudent));
            setIsEditing(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editedStudent) {
            setEditedStudent({ ...editedStudent, [e.target.name]: e.target.value });
        }
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!editedStudent) {
        return (
            <Container>
                <Typography>No student data available.</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Student Profile
            </Typography>

            <form>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Name"
                            name="studentName"
                            value={editedStudent.studentName}
                            onChange={handleChange}
                            // disabled={!isEditing}
                            disabled
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            name="email"
                            value={editedStudent.email}
                            onChange={handleChange}
                            // disabled={!isEditing}
                            disabled
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Contact Number"
                            name="contactNumber"
                            value={editedStudent.contactNumber}
                            onChange={handleChange}
                            // disabled={!isEditing}
                            disabled
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Father Name"
                            name="fatherName"
                            value={editedStudent.fatherName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Mother Name"
                            name="motherName"
                            value={editedStudent.motherName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Date of Birth"
                            name="dob"
                            value={editedStudent.dob}
                            onChange={handleChange}
                            disabled={!isEditing}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Address"
                            name="address"
                            value={editedStudent.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Parent Contact Number"
                            name="parentContactNumber"
                            value={editedStudent.parentContactNumber}
                            onChange={handleChange}
                            // disabled={!isEditing}
                            disabled
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Admission Date"
                            name="studentAdmissionDate"
                            value={editedStudent.studentAdmissionDate}
                            onChange={handleChange}
                            // disabled={!isEditing}
                            disabled
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Start Date"
                            name="classStartDate"
                            value={editedStudent.classStartDate}
                            onChange={handleChange}
                            // disabled={!isEditing}
                            disabled
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </form><br />
            {isEditing ? (
                <div>
                    <Button variant="contained" color="primary" onClick={handleSaveClick}>
                        Save
                    </Button>
                    <Button variant="outlined" onClick={handleCancelClick} sx={{ ml: 1 }}>
                        Cancel
                    </Button>
                </div>
            ) : (
                <Button variant="contained" onClick={handleEditClick}>
                    Edit Profile
                </Button>
            )}
        </Container>
    );
};

export default Profile;