import { memo } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { RootState } from '../../../store/store';
import { getTicketStatusLabel } from '../../common/ticket-utils';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

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
      icon={selectedTicket?.completed ? <CheckCircleIcon /> : <CancelIcon />}
    />
  </Box>
);

export default memo(TicketDetailsHeader);
