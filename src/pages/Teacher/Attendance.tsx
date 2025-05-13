import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Navigate } from "react-router-dom";
import { roles } from "../../utils/roles";
import Student from "../dms/Student/Student";

const Attendance: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user?.roles.includes(roles.teacher[0])) return <Navigate to="/dashboard" />;

  return (
    <>
    <Student />
    </>
  );
};

export default Attendance;


