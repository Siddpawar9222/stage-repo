import React, { useEffect, useState, ChangeEvent } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Grid, MenuItem, Alert
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { getAllLedgerheadsApi } from '../../services/apis/pms/ledgerHeadService';
import { closeModal, openModal } from '../../app/reducers/modalSlice';
import { MODAL_CONSTANTS } from '../../utils/modalUtils';
import { showNotification } from '../../app/reducers/headerSlice';
import { addAdditionalChargeToClassDue } from '../../services/apis/pms/paymentService';

// Interfaces
interface LedgerHead {
    ledgerHeadId: string;
    ledgerHeadName: string;
}

interface AdditionalCharge {
    additionalChargeName: string;
    thresholdAmount: string;
    amount: string;
    dueDate: string;
    ledgerHeadId: string;
}

interface AddAdditionalChargeProps {
    isOpen: boolean;
    extraObject: object ;
}

const ClassAdditionalChargeModel: React.FC<AddAdditionalChargeProps> = ({ isOpen,extraObject }) => {
    const dispatch = useDispatch();

    const [additionalCharge, setAdditionalCharge] = useState<AdditionalCharge>({
        additionalChargeName: '',
        thresholdAmount: '',
        amount: '',
        dueDate: '',
        ledgerHeadId: '',
    });

    const [ledgerHeadsData, setLedgerHeadsData] = useState<LedgerHead[]>([]);
    const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof AdditionalCharge, string>>>({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const fetchAllLedgerHeads = async () => {
            const response = await getAllLedgerheadsApi();
            if (response.status === 200) {
                setLedgerHeadsData(response?.data?.data || []);
            }else {
                dispatch(
                    openModal({
                        title: response?.statusText,
                        bodyType: MODAL_CONSTANTS.ERROR,
                    })
                );
            }
        };

        fetchAllLedgerHeads();
    }, [dispatch]);



    console.log(additionalCharge);



    const updateFormValue = (updateType: keyof AdditionalCharge, value: string) => {
        setErrorMessage('');
        setValidationErrors({});
        setAdditionalCharge(prev => ({ ...prev, [updateType]: value }));
    };

    const handleSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedId = event.target.value;
        const selectedOption = ledgerHeadsData?.find(item => item.ledgerHeadId === selectedId);

        if (selectedOption) {
            setAdditionalCharge({
                ...additionalCharge,
                additionalChargeName: selectedOption.ledgerHeadName,
                ledgerHeadId: selectedOption.ledgerHeadId
            });
        }
    };

    const validateForm = (): Partial<Record<keyof AdditionalCharge, string>> => {
        const errors: Partial<Record<keyof AdditionalCharge, string>> = {};

        if (!additionalCharge.ledgerHeadId) errors.ledgerHeadId = "Ledger Head is required.";
        if (!additionalCharge.additionalChargeName || additionalCharge.additionalChargeName.length < 3 || additionalCharge.additionalChargeName.length > 50) {
            errors.additionalChargeName = "Name must be between 3 and 50 characters.";
        }
        if (!additionalCharge.thresholdAmount || parseFloat(additionalCharge.thresholdAmount) <= 0) {
            errors.thresholdAmount = "Threshold amount must be greater than 0.";
        }
        if (!additionalCharge.amount || parseFloat(additionalCharge.amount) <= 0) {
            errors.amount = "Min Fee Condition must be greater than 0.";
        }
        if (!additionalCharge.dueDate) {
            errors.dueDate = "Due date is required.";
        }

        return errors;
    };

    const handleSubmitAdditionalChargeData = async () => {
        setErrorMessage("");
        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setLoading(true);
        const response = await addAdditionalChargeToClassDue(additionalCharge);

        if (response?.status !== 200) {
            if (response.status === 400) {
                setErrorMessage(response?.statusText);
            } else {
                dispatch(
                    openModal({
                        title: response?.statusText,
                        bodyType: MODAL_CONSTANTS.ERROR,
                    }),
                )
            }
        } else {
            dispatch(
                showNotification({
                    message: "Charges Applied – CSV Downloaded!",
                    status: 1,
                }),
            )
            handleClose();

        }

        setLoading(false);
    };

    const handleClose = () => {
        dispatch(closeModal());
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ paddingBottom: "8px" }}>
                ADD LATE FINE TO ALL CLASS STUDENTS
            </DialogTitle>

            <DialogContent sx={{ padding: "24px" }}>

                <Grid item xs={12} mb={2} mt={2}>
                    <Alert severity="warning">
                        This action will add the additional charge to all applicable students and action cannot be reverted.
                        Please ensure the details are correct before proceeding.
                    </Alert>
                </Grid>

                <Grid container spacing={2}>
                    {/* Ledger Head Select */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            value={additionalCharge.ledgerHeadId}
                            label="Ledger Head"
                            onChange={handleSelectChange}
                            variant="outlined"
                            margin="normal"
                            error={!!validationErrors.ledgerHeadId}
                            helperText={validationErrors.ledgerHeadId}
                        >
                            {ledgerHeadsData?.map(item => (
                                <MenuItem key={item.ledgerHeadId} value={item.ledgerHeadId}>
                                    {item.ledgerHeadName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Threshold Amount */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Min Fee Condition (₹)"
                            value={additionalCharge.thresholdAmount}
                            onChange={(e) => updateFormValue("thresholdAmount", e.target.value)}
                            variant="outlined"
                            margin="normal"
                            type="number"
                            inputProps={{ min: 1 }}
                            error={!!validationErrors.thresholdAmount}
                            helperText={validationErrors.thresholdAmount}
                        />
                    </Grid>

                    {/* Amount */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Amount"
                            value={additionalCharge.amount}
                            onChange={(e) => updateFormValue("amount", e.target.value)}
                            variant="outlined"
                            margin="normal"
                            type="number"
                            inputProps={{ min: 1 }}
                            error={!!validationErrors.amount}
                            helperText={validationErrors.amount}
                        />
                    </Grid>

                    {/* Due Date */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Due Date"
                            type="date"
                            value={additionalCharge.dueDate}
                            onChange={(e) => updateFormValue("dueDate", e.target.value)}
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            error={!!validationErrors.dueDate}
                            helperText={validationErrors.dueDate}
                        />
                    </Grid>
                </Grid>

                {errorMessage && (
                    <Grid item xs={12} mt={2}>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{ padding: "16px 24px", justifyContent: "space-between" }}>
                <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ textTransform: "none" }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitAdditionalChargeData}
                    sx={{ textTransform: "none" }}
                    disabled={loading}
                >
                    {loading ? "Please wait..." : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ClassAdditionalChargeModel;
