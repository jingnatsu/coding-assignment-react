import { Alert, Box } from '@mui/material';
import { memo } from 'react';

interface ErrorBoxMessageProps {
  errorMessage: string;
  onClose: (value: string) => void;
}

const ErrorBoxMessage = ({ onClose, errorMessage }: ErrorBoxMessageProps) => (
  <Box sx={{ marginBottom: 2 }}>
    <Alert severity="error" onClose={() => onClose}>
      {errorMessage}
    </Alert>
  </Box>
);

export default memo(ErrorBoxMessage);
