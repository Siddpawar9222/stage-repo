import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    useTheme,
    useMediaQuery,
    Fade,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../app/reducers/modalSlice';

type Props = {
    isOpen: boolean;
    extraObject: object;
};

const PasswordWarningModal: React.FC<Props> = ({ isOpen, extraObject }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleNavigate = () => {
        dispatch(closeModal());
        navigate('/forgot-password');
    };

    const handleOnClose = () => {
        // Empty handler to prevent accidental closing
        // Could be implemented to show confirmation or just close
    };

    const iconStyle = {
        fontSize: isMobile ? 60 : 80,
        color: theme.palette.warning.main,
        filter: "drop-shadow(0 4px 8px rgba(255, 152, 0, 0.3))",
        transition: "all 0.3s ease",
        animation: "pulse 2s infinite",
        "@keyframes pulse": {
            "0%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.05)" },
            "100%": { transform: "scale(1)" }
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleOnClose}
            aria-labelledby="password-warning-dialog-title"
            aria-describedby="password-warning-dialog-description"
            fullWidth
            maxWidth="sm"
            TransitionComponent={Fade}
            transitionDuration={300}
            PaperProps={{
                elevation: 8,
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                    border: `1px solid ${theme.palette.divider}`,
                    position: 'relative',
                    p: 0,
                }
            }}
        >
            {/* Colored Top Band */}
            <Box 
                sx={{ 
                    position: "absolute", 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    height: 6, 
                    bgcolor: theme.palette.warning.main,
                    zIndex: 1,
                }} 
            />

            {/* Content Container */}
            <Box sx={{ pt: 4, pb: 3, textAlign: 'center' }}>
                {/* Icon with Animation */}
                <Box 
                    sx={{ 
                        display: "flex", 
                        justifyContent: "center", 
                        mb: 2,
                        mt: 1
                    }}
                >
                    <WarningAmberIcon sx={iconStyle} />
                </Box>

                {/* Title */}
                <Typography 
                    id="password-warning-dialog-title"
                    variant={isMobile ? "h6" : "h5"} 
                    component="h2" 
                    sx={{ 
                        mb: 1.5, 
                        color: theme.palette.warning.dark, 
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        px: isMobile ? 2 : 4,
                    }}
                >
                    Security Warning
                </Typography>

                {/* Content */}
                <DialogContent sx={{ p: 0 }}>
                    <Typography 
                        id="password-warning-dialog-description" 
                        variant="body1"
                        sx={{ 
                            px: isMobile ? 3 : 5,
                            fontSize: isMobile ? "0.95rem" : "1rem",
                            lineHeight: 1.6,
                            color: theme.palette.text.secondary,
                            mb: 3,
                            maxWidth: "85%",
                            mx: "auto",
                        }}
                    >
                        Your password is the same as your username, which creates a 
                        significant security risk. Please reset your password immediately 
                        to protect your account.
                    </Typography>
                </DialogContent>

                {/* Actions */}
                <DialogActions 
                    sx={{ 
                        justifyContent: 'center', 
                        px: isMobile ? 3 : 5,
                        pb: 2,
                    }}
                >
                    <Button 
                        variant="contained" 
                        color="warning"
                        disableElevation
                        fullWidth
                        sx={{ 
                            fontWeight: "bold",
                            py: 1.2,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: "1rem",
                            boxShadow: "0 4px 12px rgba(255, 152, 0, 0.2)",
                            transition: "all 0.2s ease",
                            maxWidth: 400,
                            "&:hover": {
                                boxShadow: "0 6px 14px rgba(255, 152, 0, 0.3)",
                                transform: "translateY(-2px)",
                            },
                            "&:active": {
                                transform: "translateY(0)",
                            }
                        }} 
                        onClick={handleNavigate}
                    >
                        Reset Password Now
                    </Button>
                </DialogActions>

                {/* Footer text */}
                <Typography 
                    variant="caption" 
                    sx={{ 
                        display: "block", 
                        mt: 2, 
                        color: theme.palette.text.disabled,
                        fontSize: "0.75rem",
                        px: 2,
                    }}
                >
                    Using strong, unique passwords helps protect your account
                </Typography>
            </Box>
        </Dialog>
    );
};

export default PasswordWarningModal;