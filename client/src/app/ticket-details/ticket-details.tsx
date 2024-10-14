import {
  assignUserToTicket,
  fetchTicketById,
  unassignTicket,
  updateTicketStatus,
} from '../../store/ticketsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
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
import { TICKET_STATUS, UNASSIGNED, UNASSIGNED_ID } from '../common/constant';
import TicketDetailsHeader from './components/TicketDetailsHeader';
import { getUserById } from '../../store/usersSlice';
import ErrorBoxMessage from '../common/components/ErrorBoxMessage';

function TicketDetails() {
  const { id: ticketId } = useParams<{ id: string }>();
  const [errorMessage, setErrorMessage] = useState('');

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
    async (userId: string) => {
      if (!ticketId || !userId) return;

      try {
        // Handle user unassignment if userId is not provided
        if (userId === '-1') {
          await dispatch(unassignTicket({ ticketId: parseInt(ticketId) }));
          setErrorMessage('');
          return;
        }

        // Check if the user exists by fetching the user by ID
        const user = await dispatch(getUserById(parseInt(userId))).unwrap();
        if (!user) {
          setErrorMessage('Not existing user, please check');
          return;
        }

        await dispatch(
          assignUserToTicket({
            ticketId: parseInt(ticketId),
            userId: parseInt(userId),
          })
        ).unwrap();

        setErrorMessage(''); // Clear any previous error if successful
      } catch (error) {
        setErrorMessage('Error fetching user or updating assignee');
      }
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
      setErrorMessage('Error when chaging status');
    }
  }, [dispatch, selectedTicket?.completed, ticketId]);

  if (loading) {
    return <CircularProgress />;
  }
  if (error || userError) {
    return <Typography color="error">{error || userError}</Typography>;
  }
  if (!selectedTicket) {
    return <Typography>No ticket found</Typography>;
  }

  const isUpdating = statusUpdating || assigning;

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ padding: 2 }}>
      <Grid item xs={12} md={10}>
        <Card elevation={3}>
          <Box sx={{ height: 2 }}>{isUpdating && <LinearProgress />}</Box>
          <CardContent>
            <TicketDetailsHeader selectedTicket={selectedTicket} />

            {errorMessage && (
              <ErrorBoxMessage
                errorMessage={errorMessage}
                onClose={() => setErrorMessage('')}
              />
            )}

            <Typography color="textSecondary" mb={2}>
              Assignee: {assigneeName}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
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
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <SelectField
                    label="Update Assignee"
                    value={selectedTicket.assigneeId || ''}
                    onChange={(e) => handleAssignUser(e.target.value as string)}
                    disabled={assigning || userLoading}
                    options={[
                      { value: UNASSIGNED_ID, label: UNASSIGNED },
                      ...users.map((user) => ({
                        value: user.id,
                        label: user.name,
                      })),
                    ]}
                  />
                </FormControl>
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
