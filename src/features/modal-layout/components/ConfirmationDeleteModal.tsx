import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../app/reducers/modalSlice";

// Define the props for the modal component
interface ConfirmationDeleteModalProps {
  isOpen: boolean;
  extraObject?: {
    handleDelete: () => void;
  };
}

const ConfirmationDeleteModal: React.FC<ConfirmationDeleteModalProps> = ({ isOpen, extraObject }) => {
  const dispatch = useDispatch();

  const onConfirm = () => {
    if (extraObject?.handleDelete) {
      extraObject.handleDelete();
    }
    dispatch(closeModal());
  };

  const onClose = () => {
    dispatch(closeModal());
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      {/* <DialogTitle>
        {"Confirm delete"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle> */}
      <DialogContent>
        <DialogContentText>{"Are you sure you want to delete this item?"}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDeleteModal;