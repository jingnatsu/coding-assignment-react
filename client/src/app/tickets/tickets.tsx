import { useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  CircularProgress,
  Autocomplete,
  FormControl,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { RootState } from '../../store/store';
import AddTicketModal from '../add-ticket/add-ticket';
import {
  STATUS_FILTER_OPTIONS,
  TICKET_STATUS,
  TicketStatusFilterType,
} from '../common/constant';
import { getAssigneeName, getTicketStatusValue } from '../common/ticket-utils';
import TicketCard from './components/TicketCard';
import SelectField from '../common/components/SelectField';

export default function Tickets() {
  const navigate = useNavigate();

  const { tickets, loading: ticketsLoading } = useSelector(
    (state: RootState) => state.tickets
  );
  const { users } = useSelector((state: RootState) => state.users);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] =
    useState<TicketStatusFilterType>('all');
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [userFilter, setUserFilter] = useState<number | null>(null);

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === 'all' ||
        getTicketStatusValue(ticket?.completed) === statusFilter;
      const matchesDescription = ticket.description
        ?.toLowerCase()
        ?.includes(descriptionFilter?.toLowerCase());
      const matchesUser =
        userFilter === null || ticket.assigneeId === userFilter;
      return matchesStatus && matchesDescription && matchesUser;
    });
  }, [tickets, statusFilter, descriptionFilter, userFilter]);

  return (
    <>
      <Grid container direction="row" spacing={2} sx={{ maxHeight: '100vh' }}>
        <Grid item xs={12}>
          <AppBar position="static" color="transparent" elevation={1}>
            <Toolbar>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                Tickets
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenModal}
              >
                Add New Ticket
              </Button>
            </Toolbar>
          </AppBar>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gap={2}>
            <FormControl>
              <SelectField
                label="Status"
                value={statusFilter}
                options={STATUS_FILTER_OPTIONS}
                onChange={(e) =>
                  setStatusFilter(e.target.value as TicketStatusFilterType)
                }
              />
            </FormControl>

            <Autocomplete
              options={users}
              getOptionLabel={(user) => user.name}
              onChange={(_, newValue) =>
                setUserFilter(newValue ? newValue.id : null)
              }
              renderInput={(params) => (
                <TextField {...params} label="Filter by User" />
              )}
              sx={{ minWidth: 150 }}
            />
            <TextField
              label="Search by Description"
              value={descriptionFilter}
              onChange={(e) => setDescriptionFilter(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ overflowY: 'auto' }}>
          {ticketsLoading ? (
            <CenteredContent>
              <CircularProgress />
            </CenteredContent>
          ) : filteredTickets.length === 0 ? (
            <CenteredContent>
              <Typography color="textSecondary">
                No tickets available.
              </Typography>
            </CenteredContent>
          ) : (
            <Grid container spacing={2}>
              {filteredTickets.map((ticket) => (
                <Grid item xs={12} md={6} lg={4} key={ticket.id}>
                  <TicketCard
                    ticket={ticket}
                    onClick={() => navigate(`/${ticket.id}`)}
                    descriptionFilter={descriptionFilter}
                    assigneeName={getAssigneeName(ticket.assigneeId, users)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
      <AddTicketModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

const CenteredContent = ({ children }: { children: React.ReactNode }) => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
    {children}
  </Box>
);
