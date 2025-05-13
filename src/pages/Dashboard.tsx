import React, { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { fetchSessions } from "../app/reducers/sessionSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);
  
  return (
    <div>
      <h2>Welcome to the Dashboard 🎉</h2>
    </div>
  )
};

export default Dashboard;
