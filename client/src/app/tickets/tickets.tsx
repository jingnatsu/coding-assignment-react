import { useState, useMemo, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { RootState } from '../../store/store';
import AddTicketModal from '../add-ticket/add-ticket';
import { Ticket } from '@acme/shared-models';

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} style={{ backgroundColor: 'yellow' }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

export interface TicketsProps {
  tickets: Ticket[];
}

export function Tickets() {
  const navigate = useNavigate();

  const { tickets, loading: ticketsLoading } = useSelector(
    (state: RootState) => state.tickets
  );
  const { users } = useSelector((state: RootState) => state.users);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'open' | 'completed'
  >('all');
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [userFilter, setUserFilter] = useState<number | null>(null);

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (ticket.completed ? 'completed' : 'open') === statusFilter;
      const matchesDescription = ticket.description
        ?.toLowerCase()
        ?.includes(descriptionFilter.toLowerCase());
      const matchesUser =
        userFilter === null || ticket.assigneeId === userFilter;
      return matchesStatus && matchesDescription && matchesUser;
    });
  }, [tickets, statusFilter, descriptionFilter, userFilter]);

  const getAssigneeName = useMemo(() => {
    return (assigneeId: number | null) => {
      if (!assigneeId) return 'Unassigned';
      const user = users.find((user) => user.id === assigneeId);
      return user ? user.name : 'Unknown';
    };
  }, [users]);

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
            <FilterSelect
              label="Status"
              value={statusFilter}
              options={[
                { value: 'all', label: 'All' },
                { value: 'open', label: 'Open' },
                { value: 'completed', label: 'Completed' },
              ]}
              onChange={(value) =>
                setStatusFilter(value as 'all' | 'open' | 'completed')
              }
            />
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
            <IconButton>
              <FilterListIcon />
            </IconButton>
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
                    getAssigneeName={getAssigneeName}
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

const FilterSelect = memo(
  ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }) => (
    <FormControl sx={{ minWidth: 150 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
);

const TicketCard = memo(
  ({
    ticket,
    onClick,
    descriptionFilter,
    getAssigneeName,
  }: {
    ticket: Ticket;
    onClick: () => void;
    descriptionFilter: string;
    getAssigneeName: (assigneeId: number | null) => string;
  }) => (
    <Card
      variant="outlined"
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: 4 },
      }}
    >
      <CardContent>
        <Typography variant="h6">
          {highlightText(ticket.description, descriptionFilter)}
        </Typography>
        <Chip
          label={ticket.completed ? 'Completed' : 'Open'}
          color={ticket.completed ? 'success' : 'default'}
          sx={{ mt: 1 }}
        />
        <Typography color="textSecondary" sx={{ mt: 1 }}>
          Assigned to: {getAssigneeName(ticket.assigneeId)}
        </Typography>
      </CardContent>
    </Card>
  )
);

const CenteredContent = ({ children }: { children: React.ReactNode }) => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
    {children}
  </Box>
);

export default Tickets;
