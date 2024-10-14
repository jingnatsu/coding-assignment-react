import { User } from '@acme/shared-models';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

// Fetch users from API
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data: User[] = await response.json();
  return data;
});

export const getUserById = createAsyncThunk(
  'users/getUserById',
  async (userId: number, { rejectWithValue }) => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      const errorMessage = await response.text();
      return rejectWithValue(`Failed: ${errorMessage}`);
    }
    return await response.json();
  }
);
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserById.fulfilled,
        (state, action: PayloadAction<{ userId: number }>) => {
          state.loading = false;
        }
      )
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export default usersSlice.reducer;
