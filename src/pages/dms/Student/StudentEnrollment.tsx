import React, { useState, useEffect } from 'react';
import { fetchEnrollmentByStudentId, EnrollmentItem } from '../../../services/apis/dms/studentEnrollment'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';

const StudentEnrollment: React.FC = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const storedStudentId = localStorage.getItem('studentId');
    if (storedStudentId) {
      setStudentId(storedStudentId);
    }
  }, []);

  useEffect(() => {
    const fetchEnrollmentData = async () => {
      if (studentId) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchEnrollmentByStudentId(studentId);
          setEnrollments(data);
        } catch (err: any) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEnrollmentData();
  }, [studentId]);

  if (!studentId) {
    return (
      <Typography variant="body1">Student ID not found in local storage.</Typography>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{`Failed to fetch enrollment data: ${error}`}</Alert>;
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Student Enrollments for Student ID: {studentId}
      </Typography>
      {enrollments.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="enrollment table">
            <TableHead>
              <TableRow>
                <TableCell>Class Name</TableCell>
                <TableCell align="left">Class ID</TableCell>
                <TableCell align="left">Session ID</TableCell>
                <TableCell align="left">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow
                  key={enrollment.enrollmentId} // Assuming enrollmentId is unique
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {enrollment.studentClassName}
                  </TableCell>
                  <TableCell align="left">{enrollment.studentClassId}</TableCell>
                  <TableCell align="left">{enrollment.sessionId}</TableCell>
                  <TableCell align="left">{enrollment.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">No enrollments found for this student.</Typography>
      )}
    </div>
  );
};

export default StudentEnrollment;