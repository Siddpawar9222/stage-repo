import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    MenuItem,
    Grid,
    IconButton,
    useTheme,
    Divider,
    alpha
} from '@mui/material';
import {
    CalendarToday as CalendarIcon,
    FileDownload as DownloadIcon,
    Article as ReportIcon
} from '@mui/icons-material';
import PageTitle from '../../../components/PageTitle';
import { useDispatch } from 'react-redux';
import { openModal, setPageTitle } from '../../../app/reducers/modalSlice';
import { downloadReport, getReportTypes } from '../../../services/apis/pms/reportService';
import { MODAL_CONSTANTS } from '../../../utils/modalUtils';
import { showNotification } from '../../../app/reducers/headerSlice';
import { roles } from "../../../utils/roles"
import { useRole } from '../../../RoleContext';


// Define TypeScript interfaces
interface ReportRequest {
    reportType: string;
    startDate: string;
    endDate: string;
}

interface ReportItemProps {
    report: ReportRequest;
    onDownload: (report: ReportRequest) => void;
}

// ReportItem component to display selected report details
const ReportItem: React.FC<ReportItemProps> = ({ report, onDownload }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                borderRadius: 2
            }}
        >
            <ReportIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                    {report.reportType}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                    <Typography variant="body2" color="text.secondary">
                        {report.startDate} to {report.endDate}
                    </Typography>
                </Box>
            </Box>
            <IconButton
                color="primary"
                onClick={() => onDownload(report)}
                sx={{
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                }}
            >
                <DownloadIcon />
            </IconButton>
        </Paper>
    );
};

// Main ReportPage component
const Report: React.FC = () => {
    const { userRole } = useRole()
    const dispatch = useDispatch();
    const theme = useTheme();

    // State variables
    const [reportTypes, setReportTypes] = useState<string[]>([]);
    const [selectedReport, setSelectedReport] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [generatedReports, setGeneratedReports] = useState<ReportRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch report types 
    useEffect(() => {
        dispatch(setPageTitle("Generate Reports"));
        const fetchReportTypes = async () => {
            const response = await getReportTypes();
            if (response?.status !== 200) {
                dispatch(
                    openModal({
                        title: response?.statusText,
                        bodyType: MODAL_CONSTANTS.ERROR,
                    }),
                )
            } else {
                setReportTypes(response?.data);
            }
        };

        fetchReportTypes();
    }, []);

    // Handle report generation
    const handleGenerateReport = () => {

        if (!selectedReport || !startDate || !endDate) {
            return;
        }

        if (userRole && userRole === roles.operator[0]) {
            // Convert dates to JavaScript Date objects
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Calculate the difference in days
            const differenceInTime = end.getTime() - start.getTime();
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);

            if (differenceInDays > 2) {
                dispatch(
                    showNotification({
                        message: "Date range cannot exceed 2 days for operator role !",
                        status: 0,
                    }),
                )
                return;
            }
        }

        const newReport: ReportRequest = {
            reportType: selectedReport,
            startDate,
            endDate
        };

        setGeneratedReports([newReport, ...generatedReports]);

        // Reset form after generating
        setSelectedReport('');
        setStartDate('');
        setEndDate('');
    };


    // Handle report download
    const handleDownloadReport = async (report: ReportRequest) => {
        setLoading(true);
        const response = await downloadReport(report.reportType, report.startDate, report.endDate);
        if (response?.status !== 200) {
            dispatch(
                openModal({
                    title: response?.statusText,
                    bodyType: MODAL_CONSTANTS.ERROR,
                }),
            )
        } else {
            dispatch(
                showNotification({
                    message: "Report Generated!",
                    status: 1,
                }),
            )
        }
        setLoading(false);
    };

    return (
        <>
            <PageTitle />
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper
                    }}
                >
                    <Grid container spacing={3} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="Report Type"
                                value={selectedReport}
                                onChange={(e) => setSelectedReport(e.target.value)}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <ReportIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                                }}
                                SelectProps={{
                                    displayEmpty: true,
                                    renderValue: (selected: unknown) => {
                                        return selected ? selected as string : "Select Report Type";
                                    }
                                }}
                            >
                                {reportTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: <CalendarIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="End Date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: <CalendarIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGenerateReport}
                            disabled={!selectedReport || !startDate || !endDate || loading}
                            startIcon={<ReportIcon />}
                        >
                            Generate Report
                        </Button>
                    </Box>
                </Paper>

                {generatedReports.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Generated Reports
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {generatedReports.map((report, index) => (
                            <ReportItem
                                key={index}
                                report={report}
                                onDownload={handleDownloadReport}
                            />
                        ))}
                    </Box>
                )}
            </Container>
        </>
    );
};

export default Report;