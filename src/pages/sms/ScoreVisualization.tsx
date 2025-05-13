import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, Typography, Paper } from "@mui/material";

Chart.register(ArcElement, Tooltip, Legend);

interface ScoreVisualizationProps {
    correct: number;
    incorrect: number;
    skipped: number;
    total: number;
    timeSpent: number;
    totalTime: number;
}

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds ? ` ${remainingSeconds}s` : ""}`;
};

const ScoreVisualization: React.FC<ScoreVisualizationProps> = ({
                                                                   correct,
                                                                   incorrect,
                                                                   skipped,
                                                                   total,
                                                                   timeSpent,
                                                                   totalTime,
                                                               }) => {
    const percentage = Math.round((correct / total) * 100);

    const scoreData = {
        labels: ["Correct", "Incorrect", "Skipped"],
        datasets: [
            {
                data: [correct, incorrect, skipped],
                backgroundColor: ["#2ECC40", "#FF4136", "#FFC300"],
            },
        ],
    };

    return (
        <Box
            width="100%"
            display="flex"
            justifyContent="center"
            gap={3}
            p={3}
        >
            {/* Left: Score Chart */}
            <Box width="50%" textAlign="center">
                <Paper sx={{ p: 3, borderRadius: "10px", boxShadow: 2 }}>
                    <Doughnut data={scoreData} options={{ cutout: "70%" }} />
                    <Typography variant="h5" fontWeight="bold" mt={2}>
                        {percentage}% Correct
                    </Typography>
                </Paper>
            </Box>

            {/* Right: Quiz Info */}
            <Box width="50%" component={Paper} sx={{ p: 3, borderRadius: "10px", boxShadow: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quiz Summary
                </Typography>
                <Typography variant="body1">
                    <strong>Total Questions:</strong> {total}
                </Typography>
                <Typography variant="body1">
                    <strong>Correct Answers:</strong> {correct}
                </Typography>
                <Typography variant="body1">
                    <strong>Incorrect Answers:</strong> {incorrect}
                </Typography>
                <Typography variant="body1">
                    <strong>Skipped:</strong> {skipped}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Time Spent:</strong> {formatTime(timeSpent)}
                </Typography>
                <Typography variant="body1">
                    <strong>Total Time:</strong> {formatTime(totalTime)}
                </Typography>
            </Box>
        </Box>
    );
};

export default ScoreVisualization;
