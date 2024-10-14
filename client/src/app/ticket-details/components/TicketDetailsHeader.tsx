import { memo } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { RootState } from '../../../store/store';
import { getTicketStatusLabel } from '../../common/ticket-utils';
import CheckCircle from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
interface TicketDetailsHeaderProps {
  selectedTicket: RootState['tickets']['selectedTicket'];
}

const TicketDetailsHeader = ({ selectedTicket }: TicketDetailsHeaderProps) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    <Typography variant="h5">
      {`Ticket #${selectedTicket?.id}: ${selectedTicket?.description}`}
    </Typography>
    <Chip
      label={getTicketStatusLabel(!!selectedTicket?.completed)}
      color={selectedTicket?.completed ? 'success' : 'default'}
      icon={
        selectedTicket?.completed ? <CheckCircle /> : <PendingActionsIcon />
      }
    />
  </Box>
);

export default memo(TicketDetailsHeader);
