// UserProfile.tsx
import React, { useState, useEffect } from "react"
import PaymentGrid from "../../pms/PaymentGrid"
import { fetchStudentByEmail } from "../../../services/apis/dms/studentService"
import { useDispatch } from "react-redux"
import { Box, CircularProgress } from "@mui/material"

interface Student {
    studentId: string;
    studentName: string;
    email?: string;
    fatherName?: string;
    motherName?: string;
    address?: string;
    studentAdmissionDate?: string;
    classStartDate?: string;
}

const StudentPaymentProfile: React.FC = () => {
  const [profileStudentId, setProfileStudentId] = useState<string | null>(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<
    "idle" | "pending" | "succeeded" | "failed"
  >("idle")
  const [error, setError] = useState<string | null>(null)
  const [studentName, setStudentName] = useState<string>("") // You might fetch this from profile data
  const [localStudentId, setLocalStudentId] = useState<string | null>(
    localStorage.getItem("studentId"),
  )
  const [isFetchingStudent, setIsFetchingStudent] = useState(false)
  const [searchedStudentForGrid, setSearchedStudentForGrid] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudentId = async () => {
      if (!localStudentId) {
        setIsFetchingStudent(true);
        try {
          const student = await fetchStudentByEmail();
          if (student?.studentId) {
            localStorage.setItem("studentId", student.studentId);
            setLocalStudentId(student.studentId);
            setProfileStudentId(student.studentId);
setSearchedStudentForGrid({ studentId: student.studentId, studentName: student.studentName || "" });
            } else {
            setError("Failed to retrieve student ID.");
            setSearchedStudentForGrid(null);
          }
        } catch (error: any) {
          setError("Failed to fetch student information.");
          console.error(error);
        } finally {
          setIsFetchingStudent(false);
        }
      } else {
        setProfileStudentId(localStudentId);
        setSearchedStudentForGrid({ studentId: localStudentId, studentName: studentName });
      }
    };
  
    fetchStudentId();
  }, [localStudentId, studentName]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (localStudentId) {
        setLoading("pending");
        setError(null);
        try {
          setStudentName("Student Name Fetched");
          setLoading("succeeded");
        } catch (error: any) {
          setError("Failed to fetch student details.");
          setLoading("failed");
          console.error(error);
        }
      }
    };
  
    fetchStudentDetails();
  }, [localStudentId]);

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", paddingBottom: "30px" }}>
        {isFetchingStudent && <CircularProgress />}
      {localStudentId && (
        <PaymentGrid
          selectedClassId={null}
          selectedStudentId={null}
          studentName={studentName}
          selectedStudent={undefined}
          searchedStudent={null}
          profileStudentId={profileStudentId}
          setLoading={setLoading}
          setError={setError}
        />
      )}
      {loading === "pending" && <div>Loading Payment Data...</div>}
      {error && (
        <div style={{ color: "red" }}>Error loading payment data: {error}</div>
      )}
    </Box>
  )
}

export default StudentPaymentProfile;
