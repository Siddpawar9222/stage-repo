import React from "react";
import { useDispatch } from "react-redux";
import { Modal, Box, Typography, Button } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { closeModal } from "../../../app/reducers/modalSlice";


// Define props for the modal component
interface SessionExpiredModalProps {
  isOpen: boolean;
  message?: string;
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ isOpen, message }) => {
  const dispatch = useDispatch();

  const handleLoginRedirect = () => {
    dispatch(closeModal());
    //handleLogout();  write code for logout
    window.location.href = "/auth/login";
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: "center",
  };

  return (
    <Modal open={isOpen} onClose={handleLoginRedirect}>
      <Box sx={style}>
        {/* Icon */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <WarningAmberIcon sx={{ fontSize: 50, color: "warning.main" }} />
        </Box>

        {/* Session Expired Title */}
        <Typography variant="h6" component="h2" sx={{ mb: 1, color: "warning.main", fontWeight: "bold" }}>
          Session Expired
        </Typography>

        {/* Message */}
        <Typography sx={{ color: "text.secondary", mb: 4 }}>
          {message || "Your session has expired. Please log in again to continue."}
        </Typography>

        {/* OK Button */}
        <Button variant="contained" color="warning" sx={{ width: "100%", fontWeight: "bold" }} onClick={handleLoginRedirect}>
          OK
        </Button>
      </Box>
    </Modal>
  );
};

export default SessionExpiredModal;
