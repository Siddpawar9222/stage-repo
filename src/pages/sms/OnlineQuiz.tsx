import type React from "react";
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import QuizTable from "./QuizTable";
import PageTitle from "../../components/PageTitle";
import { useAppDispatch } from "../../app/hooks";
import { setPageTitle } from "../../app/reducers/modalSlice";

const OnlineQuiz: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setPageTitle("Online Quiz"));
    }, [dispatch]);

    return (
        <>
            <PageTitle />
            <Box sx={{ margin: "20px auto", maxWidth: "1200px" }}>
                <QuizTable />
            </Box>
        </>
    );
};

export default OnlineQuiz;

