import { Ticket } from '@acme/shared-models';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TicketsState {
  tickets: Ticket[];
  loading: boolean;
  assigning: boolean;
  selectedTicket: Ticket | null;
  statusUpdating: boolean;
  error: string | null;
}

const initialState: TicketsState = {
  tickets: [],
  loading: false,
  assigning: false,
  statusUpdating: false,
  selectedTicket: null,
  error: null,
};

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async () => {
    const response = await fetch('/api/tickets');
    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }
    const data: Ticket[] = await response.json();
    return data;
  }
);

// Create a new ticket on the server
export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (description: string, { rejectWithValue }) => {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return rejectWithValue(`Failed: ${errorMessage}`);
    }
    return await response.json();
  }
);

// Fetch a specific ticket by ID from API
export const fetchTicketById = createAsyncThunk(
  'tickets/fetchTicketById',
  async (id: number, { rejectWithValue }) => {
    const response = await fetch(`/api/tickets/${id}`);
    if (!response.ok) {
      const errorMessage = await response.text();
      return rejectWithValue(`Failed: ${errorMessage}`);
    }
    return await response.json();
  }
);

// Assign a user to a ticket
export const assignUserToTicket = createAsyncThunk(
  'tickets/assignUserToTicket',
  async (
    { ticketId, userId }: { ticketId: number; userId: number },
    { rejectWithValue }
  ) => {
    const response = await fetch(`/api/tickets/${ticketId}/assign/${userId}`, {
      method: 'PUT',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return rejectWithValue(`Failed: ${errorMessage}`);
    }
    return { ticketId, userId };
  }
);

// UnAssign a user to a ticket
export const unassignTicket = createAsyncThunk(
  'tickets/unassignTicket',
  async ({ ticketId }: { ticketId: number }, { rejectWithValue }) => {
    const response = await fetch(`/api/tickets/${ticketId}//unassign`, {
      method: 'PUT',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return rejectWithValue(`Failed: ${errorMessage}`);
    }
    return { ticketId };
  }
);

// Dynamic thunk to mark ticket as complete or incomplete
export const updateTicketStatus = createAsyncThunk(
  'tickets/updateTicketStatus',
  async (
    { id, method }: { id: number; method: 'PUT' | 'DELETE' },
    { rejectWithValue }
  ) => {
    const response = await fetch(`/api/tickets/${id}/complete`, {
      method,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return rejectWithValue(`Failed: ${errorMessage}`);
    }

    return { id, completed: method === 'PUT' };
  }
);

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTickets.fulfilled,
        (state, action: PayloadAction<Ticket[]>) => {
          state.loading = false;
          state.tickets = action.payload;
        }
      )
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tickets';
      })
      .addCase(createTicket.pending, (state) => {
        state.loading = true; // Set creating state to true
        state.error = null;
      })
      .addCase(
        createTicket.fulfilled,
        (state, action: PayloadAction<Ticket>) => {
          state.loading = false;
          state.tickets.push(action.payload); // Add the new ticket to the state
        }
      )
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create ticket';
      })
      .addCase(fetchTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTicketById.fulfilled,
        (state, action: PayloadAction<Ticket>) => {
          state.loading = false;
          state.selectedTicket = action.payload;
        }
      )
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ticket details';
      })
      .addCase(assignUserToTicket.pending, (state) => {
        state.assigning = true; // Set assigning state to true
        state.error = null;
      })
      .addCase(
        assignUserToTicket.fulfilled,
        (
          state,
          action: PayloadAction<{ ticketId: number; userId: number }>
        ) => {
          state.assigning = false; // Set assigning state to false

          // Update the selected ticket and ticket list with the new assignee
          if (
            state.selectedTicket &&
            state.selectedTicket.id === action.payload.ticketId
          ) {
            state.selectedTicket.assigneeId = action.payload.userId;
          }
          const index = state.tickets.findIndex(
            (t) => t.id === action.payload.ticketId
          );
          if (index !== -1) {
            state.tickets[index].assigneeId = action.payload.userId;
          }
        }
      )
      .addCase(assignUserToTicket.rejected, (state, action) => {
        state.assigning = false; // Reset assigning state
        state.error = action.error.message || 'Failed to assign user to ticket';
      })
      .addCase(unassignTicket.pending, (state) => {
        state.assigning = true; // Set assigning state to true
        state.error = null;
      })
      .addCase(
        unassignTicket.fulfilled,
        (state, action: PayloadAction<{ ticketId: number }>) => {
          state.assigning = false; // Set assigning state to false

          // Update the selected ticket and ticket list with the new assignee
          if (
            state.selectedTicket &&
            state.selectedTicket.id === action.payload.ticketId
          ) {
            state.selectedTicket.assigneeId = null;
          }
          const index = state.tickets.findIndex(
            (t) => t.id === action.payload.ticketId
          );
          if (index !== -1) {
            state.tickets[index].assigneeId = null;
          }
        }
      )
      .addCase(unassignTicket.rejected, (state, action) => {
        state.assigning = false;
        state.error = action.error.message || 'Failed to assign user to ticket';
      })
      .addCase(updateTicketStatus.pending, (state) => {
        state.statusUpdating = true;
        state.error = null;
      })
      .addCase(
        updateTicketStatus.fulfilled,
        (state, action: PayloadAction<{ id: number; completed: boolean }>) => {
          state.statusUpdating = false;
          if (
            state.selectedTicket &&
            state.selectedTicket.id === action.payload.id
          ) {
            state.selectedTicket.completed = action.payload.completed;
          }
          const index = state.tickets.findIndex(
            (t) => t.id === action.payload.id
          );
          if (index !== -1) {
            state.tickets[index].completed = action.payload.completed;
          }
        }
      )
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.statusUpdating = false; // Reset loading state on failure
      });
  },
});

export default ticketsSlice.reducer;
