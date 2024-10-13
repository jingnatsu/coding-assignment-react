import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import styles from './app.module.css';
import Tickets from './tickets/tickets';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { fetchUsers } from '../store/usersSlice';
import { fetchTickets } from '../store/ticketsSlice';
import TicketDetails from './ticket-details/ticket-details';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Very basic way to synchronize state with server.
  // Feel free to use any state/fetch library you want (e.g. react-query, xstate, redux, etc.).
  useEffect(() => {
    dispatch(fetchTickets());
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className={styles['app']}>
      <Routes>
        <Route path="/" element={<Tickets />} />
        {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
        <Route path="/:id" element={<TicketDetails />} />
      </Routes>
    </div>
  );
};

export default App;
