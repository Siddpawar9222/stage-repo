import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { removeNotificationMessage } from "../app/reducers/headerSlice";

const SnackbarNotification: React.FC = () => {
  const dispatch = useDispatch();
  
  // Get notification data from Redux
  const message = useSelector((state: any) => state.header.newNotificationMessage);
  const status = useSelector((state: any) => state.header.newNotificationStatus);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      // Optional: If you want the Snackbar to stay open when clicked away, return here
      // return;
    }

    setOpen(false);
    // Clear the message from Redux state after closing
    dispatch(removeNotificationMessage({}));
  };

  if (!message || status === null) return null;

  const severityMap: Record<number, AlertColor> = {
    0: "error",
    1: "success",
    2: "info",
    3: "warning",
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={10000} 
      onClose={handleClose}
    >
      <Alert 
        severity={severityMap[status]} 
        variant="filled" 
        sx={{ width: "100%" }}
        action={
          <IconButton size="small" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarNotification;
