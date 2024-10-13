import {
  assignUserToTicket,
  fetchTicketById,
  unassignTicket,
  updateTicketStatus,
} from '../../store/ticketsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const ticketId = id ? parseInt(id) : null;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { selectedTicket, loading, error, assigning, statusUpdating } =
    useSelector((state: RootState) => state.tickets);
  const {
    users,
    loading: userLoading,
    error: userError,
  } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (ticketId) dispatch(fetchTicketById(ticketId));
  }, [dispatch, ticketId]);

  const getAssigneeName = useMemo(() => {
    if (!selectedTicket?.assigneeId) return 'Unassigned';
    const user = users.find((user) => user.id === selectedTicket.assigneeId);
    return user ? user.name : 'Unknown';
  }, [selectedTicket, users]);

  const handleAssignUser = (userId: string) => {
    if (!ticketId) return;
    const action = userId
      ? assignUserToTicket({ ticketId, userId: parseInt(userId) })
      : unassignTicket({ ticketId });
    dispatch(action);
  };

  const handleStatusChange = async () => {
    if (!ticketId) return;
    const method = selectedTicket?.completed ? 'DELETE' : 'PUT';
    try {
      await dispatch(updateTicketStatus({ id: ticketId, method })).unwrap();
    } catch {
      console.error('Error updating status');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!selectedTicket) return <Typography>No ticket found</Typography>;

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ padding: 2 }}>
      <Grid item xs={12} md={10}>
        <Card elevation={3}>
          {statusUpdating || assigning ? (
            <LinearProgress />
          ) : (
            <Box sx={{ height: 2 }} />
          )}

          <CardContent>
            <Header selectedTicket={selectedTicket} />
            <Typography color="textSecondary" mb={2}>
              Assignee: {getAssigneeName}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <SelectField
                  label="Update Status"
                  value={selectedTicket.completed ? 'complete' : 'incomplete'}
                  onChange={handleStatusChange}
                  disabled={statusUpdating}
                  options={[
                    { value: 'complete', label: 'Mark as Complete' },
                    { value: 'incomplete', label: 'Mark as Incomplete' },
                  ]}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <SelectField
                  label="Update Assignee"
                  value={selectedTicket.assigneeId || ''}
                  onChange={(e) => handleAssignUser(e.target.value)}
                  disabled={assigning || userLoading}
                  options={[
                    { value: '', label: 'Unassigned' },
                    ...users.map((user) => ({
                      value: user.id,
                      label: user.name,
                    })),
                  ]}
                />
              </Grid>
            </Grid>
          </CardContent>

          <Divider />

          <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/')}
            >
              Back to List
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}

export default TicketDetails;

const Header = ({
  selectedTicket,
}: {
  selectedTicket: RootState['tickets']['selectedTicket'];
}) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    <Typography variant="h5">
      {`Ticket #${selectedTicket?.id}: ${selectedTicket?.description}`}
    </Typography>
    <Chip
      label={selectedTicket?.completed ? 'Completed' : 'Open'}
      color={selectedTicket?.completed ? 'success' : 'default'}
      icon={selectedTicket?.completed ? <CheckCircleIcon /> : <CancelIcon />}
    />
  </Box>
);

interface SelectFieldProps {
  label: string;
  value: string | number;
  onChange: (event: SelectChangeEvent<any>, child: React.ReactNode) => void;
  disabled?: boolean;
  options: { value: string | number; label: string }[];
}

const SelectField = ({
  label,
  value,
  onChange,
  disabled = false,
  options,
}: SelectFieldProps) => (
  <FormControl fullWidth margin="normal">
    <InputLabel>{label}</InputLabel>
    <Select value={value} onChange={onChange} disabled={disabled}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
