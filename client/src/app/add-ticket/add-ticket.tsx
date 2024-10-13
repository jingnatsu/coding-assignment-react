import { useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { AppDispatch, RootState } from '../../store/store';
import { createTicket } from '../../store/ticketsSlice';

interface AddTicketModalProps {
  open: boolean;
  onClose: () => void;
}

const AddTicketModal = ({ open, onClose }: AddTicketModalProps) => {
  const [description, setDescription] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: RootState) => state.tickets.loading);

  const handleAddTicket = useCallback(async () => {
    if (!description.trim()) return;
    await dispatch(createTicket(description));
    setDescription('');
    onClose();
  }, [description, dispatch, onClose]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  }, []);

  const isDisabled = loading || !description.trim();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Ticket</DialogTitle>
      <DialogContent>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={handleChange}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleAddTicket}
          color="primary"
          disabled={isDisabled}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Adding...' : 'Add Ticket'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(AddTicketModal);
