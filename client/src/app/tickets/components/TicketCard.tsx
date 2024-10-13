import { Ticket } from '@acme/shared-models';
import { Card, CardContent, Chip, Typography } from '@mui/material';
import { memo } from 'react';
import { getTicketStatusLabel } from '../../common/ticket-utils';

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

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
  descriptionFilter: string;
  assigneeName: string;
}

const TicketCard = ({
  ticket,
  onClick,
  descriptionFilter,
  assigneeName,
}: TicketCardProps) => (
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
        label={getTicketStatusLabel(!!ticket?.completed)}
        color={ticket?.completed ? 'success' : 'default'}
        sx={{ mt: 1 }}
      />
      <Typography color="textSecondary" sx={{ mt: 1 }}>
        Assigned to: {assigneeName}
      </Typography>
    </CardContent>
  </Card>
);

export default memo(TicketCard);
