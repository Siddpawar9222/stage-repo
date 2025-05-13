import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { Navigate } from "react-router-dom";

const Certificate: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user?.roles.includes("Student")) return <Navigate to="/dashboard" />;

  return <div>View Certificates</div>;
};

export default Certificate;
