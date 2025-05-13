import React, { useEffect, useState } from "react"
import { Add, Edit, Delete } from "@mui/icons-material"
import {
  Box,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  IconButton,
  TablePagination,
  useTheme,
} from "@mui/material"
import { useRole } from "../../../RoleContext"
import { roles } from "../../../utils/roles"
import { useDispatch } from "react-redux"
import {
  ChapterItem,
  deleteChapter,
  fetchAllChaptersByClassAndSubject,
} from "../../../services/apis/dms/chapterService"
import AddEditChapter from "./AddEditChapter"
import { showNotification } from "../../../app/reducers/headerSlice"
import NotFound from "../../404";

interface ChapterGridProps {
  classId: string
  subjectId: string
}

const ChapterGrid: React.FC<ChapterGridProps> = ({ classId, subjectId }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { userRole } = useRole()
  const [loading, setLoading] = useState<boolean>(false)
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [chapters, setChapters] = useState<ChapterItem[]>([])
  const [direction, setDirection] = useState<"asc" | "desc">("asc")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<
    ChapterItem | undefined
  >(undefined)
  const [apiError, setApiError] = useState<boolean>(false);

  const fetchChapters = async () => {
    setLoading(true)
    try {
      const response = await fetchAllChaptersByClassAndSubject(
        classId,
        subjectId,
      )
      setChapters(response.reverse())
      setTotalElements(response.length)
    } catch (error) {
      console.error("Error fetching chapters:", error)
      setApiError(true);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (classId && subjectId) {
      fetchChapters()
    }
  }, [classId, subjectId])

  const handlePageNumber = (event: unknown, newPage: number) => {
    setPageNumber(newPage)
  }

  const handlePageSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10))
    setPageNumber(0)
  }

  const handleAddChapter = () => {
    setSelectedChapter(undefined)
    setModalOpen(true)
  }

  const handleEditChapter = (chapter: ChapterItem) => {
    setSelectedChapter(chapter)
    setModalOpen(true)
  }

  const handleDeleteChapter = async (id: number) => {
    setLoading(true)
    try {
      await deleteChapter(id)
      dispatch(showNotification({ message: "Chapter deleted successfully!", status: 1 }));
      fetchChapters()
    } catch (error) {
      console.error("Error deleting chapter", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  if (apiError) {
    return <NotFound />;
  }

  return (
    <Box sx={{ margin: "20px auto", maxWidth: "1200px" }}>
      <Box
        display="flex"
        justifyContent="end"
        alignItems="end"
        mb={2}
        p={2}
        sx={{ background: theme.palette.background.paper }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddChapter}
          disabled={loading}
        >
          <Add />
          Add Chapter
        </Button>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="chapters table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Chapter Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>              
              </TableRow>
            </TableHead>
            <TableBody>
              {chapters.map((chapter, index) => (
                <TableRow key={chapter.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{chapter.chapterName}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditChapter(chapter)}>
                      <Edit
                        sx={{
                          color: "yellow",
                        }}
                      />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteChapter(chapter.id || 0)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={totalElements}
            rowsPerPage={pageSize}
            page={pageNumber}
            onPageChange={handlePageNumber}
            onRowsPerPageChange={handlePageSize}
          />
        </TableContainer>
      </Paper>
      <AddEditChapter
        isOpen={modalOpen}
        chapter={selectedChapter}
        classId={classId}
        subjectId={subjectId}
        onSuccess={fetchChapters}
        onClose={handleCloseModal}
      />
    </Box>
  )
}

export default ChapterGrid
