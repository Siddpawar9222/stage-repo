// src/components/common/SessionFilter.tsx

import { useDispatch, useSelector } from 'react-redux';
import {
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  useTheme,
  SelectChangeEvent,
} from '@mui/material';
import { setSelectedSession } from '../../app/reducers/sessionSlice';
import { RootState } from '../../app/store';

const SessionFilter: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { sessions, selectedSession } = useSelector((state: RootState) => state.session);

  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);
    const selected = sessions.find((s) => s.id === selectedId);
    if (selected) {
      dispatch(setSelectedSession(selected));
    }
  };
  

  return (
    <FormControl fullWidth>
      <InputLabel id="session-select-label">Session</InputLabel>
      <Select
        labelId="session-select-label"
        value={selectedSession?.id || ''}
        onChange={handleChange}
        label="Session"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      > 
       <MenuItem value="">
            <em>Select Session</em>
          </MenuItem>
        {sessions.map((session,index) => (
          <MenuItem key={session.id} value={session.id}>
            {
               index ===0 ? `${session.sessionName} (Active)` : `${session.sessionName}`
            }
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SessionFilter;
