import React from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Divider,
    Grid,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLocation, useNavigate } from "react-router-dom";
import { AddPaymentSuccessResponse } from '../../services/apis/pms/paymentService'; 
// import { convertLocalDateToReadableFormat } from "../../../../utils/dateUtil";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const  data :  AddPaymentSuccessResponse['data'] = (location.state as AddPaymentSuccessResponse)?.data || { // adjusted to the new data structure
        id: 0,
        studentPaymentId: "",
        paymentMode: "",
        paidAmount: 0,
        notNumber: "",
        upiId: "",
        remarks: "",
        receiptId: "",
        studentId: "",
        classId: null,
        paymentDate: "",
        sessionId: "",
      };
      const studentName: string = (location.state as {studentName: string})?.studentName || "";

    const handleAddMore = () => {
        navigate("/studentPayment");
    }

    const handleGoToHomePage = () => {
        navigate("/dashboard");
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100%"
        >
            <Card
                sx={{
                    maxWidth: 400,
                    width: "90%",
                    borderRadius: 4,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                }}
            >
                <CardContent>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <CheckCircleOutlineIcon
                            sx={{ fontSize: 50, color: "green" }}
                        />
                    </Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Payment Added Successful for {studentName}
                    </Typography>
                    <Typography mb={3}>
                        Thank you for your payment.
                    </Typography>
                    <Divider />
                    <Grid container spacing={2} mt={2} mb={2}>
                        <Grid item xs={6}>
                            <Typography >Amount Paid: </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight="bold">₹ {data?.paidAmount}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography >Payment Mode:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight="bold">{data?.paymentMode}</Typography>
                        </Grid>
                           
                        <Grid item xs={6}>
                            <Typography >Receipt Id:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight="bold">{data?.receiptId}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography >Date & Time:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight="bold">
                               {/* {convertLocalDateToReadableFormat(data?.paymentDate)} */}
                               {data?.paymentDate}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        flexDirection={{ xs: "column", sm: "row" }}
                        mt={3}
                        gap={1}
                    >
                        <Button
                            variant="contained"
                            sx={{ textTransform: "none", flex: 1 }}
                            onClick={handleAddMore}
                        >
                            Add More
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ textTransform: "none", flex: 1 }}
                            onClick={handleGoToHomePage}
                        >
                            Go To Home
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PaymentSuccess;