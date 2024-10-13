import { configureStore } from "@reduxjs/toolkit";
import ticketsReducer from './ticketsSlice';
import usersReducer from './usersSlice';

export const store = configureStore({
    reducer: {
      tickets: ticketsReducer,
      users: usersReducer,
    },
  });

  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;