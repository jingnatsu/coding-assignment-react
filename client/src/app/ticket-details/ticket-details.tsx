import {
  assignUserToTicket,
  fetchTicketById,
  unassignTicket,
  updateTicketStatus,
} from '../../store/ticketsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { useCallback, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';

import SelectField from '../common/components/SelectField';
import {
  getAssigneeName,
  getTicketStatusLabel,
  getTicketStatusValue,
} from '../common/ticket-utils';
import { TICKET_STATUS, UNASSIGNED } from '../common/constant';
import TicketDetailsHeader from './components/TicketDetailsHeader';

function TicketDetails() {
  const { id: ticketId } = useParams<{ id: string }>();

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
    if (ticketId) {
      dispatch(fetchTicketById(parseInt(ticketId)));
    }
  }, [dispatch, ticketId]);

  const assigneeName = useMemo(
    () => getAssigneeName(selectedTicket?.assigneeId, users),
    [selectedTicket, users]
  );

  const handleAssignUser = useCallback(
    (userId: string) => {
      if (!ticketId) {
        return;
      }
      const action = userId
        ? assignUserToTicket({
            ticketId: parseInt(ticketId),
            userId: parseInt(userId),
          })
        : unassignTicket({ ticketId: parseInt(ticketId) });
      dispatch(action);
    },
    [dispatch, ticketId]
  );

  const handleStatusChange = useCallback(async () => {
    if (!ticketId) {
      return;
    }
    const method = selectedTicket?.completed ? 'DELETE' : 'PUT';
    try {
      await dispatch(updateTicketStatus({ id: parseInt(ticketId), method }));
    } catch {
      console.error('Error updating status');
    }
  }, [dispatch, selectedTicket?.completed, ticketId]);

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  if (!selectedTicket) {
    return <Typography>No ticket found</Typography>;
  }

  const isLoading = statusUpdating || assigning;

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ padding: 2 }}>
      <Grid item xs={12} md={10}>
        <Card elevation={3}>
          <Box sx={{ height: 2 }}>{isLoading && <LinearProgress />}</Box>
          <CardContent>
            <TicketDetailsHeader selectedTicket={selectedTicket} />
            <Typography color="textSecondary" mb={2}>
              Assignee: {assigneeName}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <SelectField
                  label="Update Status"
                  value={getTicketStatusValue(selectedTicket.completed)}
                  onChange={handleStatusChange}
                  disabled={statusUpdating}
                  options={[
                    {
                      value: TICKET_STATUS.COMPLETE,
                      label: getTicketStatusLabel(true),
                    },
                    {
                      value: TICKET_STATUS.INCOMPLETE,
                      label: getTicketStatusLabel(false),
                    },
                  ]}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <SelectField
                  label="Update Assignee"
                  value={selectedTicket.assigneeId || ''}
                  onChange={(e) => handleAssignUser(e.target.value as string)}
                  disabled={assigning || userLoading}
                  options={[
                    { value: '', label: UNASSIGNED },
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
