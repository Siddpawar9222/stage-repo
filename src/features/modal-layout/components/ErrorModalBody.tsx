import React from "react";
import { useDispatch } from "react-redux";
import { Modal, Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { closeModal } from "../../../app/reducers/modalSlice";


// Define props for the modal component
interface ErrorModalBodyProps {
  isOpen: boolean;
  message?: string;
}

const ErrorModalBody: React.FC<ErrorModalBodyProps> = ({ isOpen, message }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal());
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
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        {/* Icon */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <ErrorOutlineIcon sx={{ fontSize: 50, color: "error.main" }} />
        </Box>

        {/* Error Title */}
        <Typography variant="h6" component="h2" sx={{ mb: 1, color: "error.main", fontWeight: "bold" }}>
          Error
        </Typography>

        {/* Message */}
        <Typography sx={{ color: "text.secondary", mb: 4 }}>
          {message || "There was an error processing your request."}
        </Typography>

        {/* OK Button */}
        <Button variant="contained" color="error" onClick={handleClose} sx={{ width: "100%", fontWeight: "bold" }}>
          OK
        </Button>
      </Box>
    </Modal>
  );
};

export default ErrorModalBody;
