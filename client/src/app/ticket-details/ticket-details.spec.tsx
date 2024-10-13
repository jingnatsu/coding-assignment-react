import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import TicketDetails from './ticket-details';
import ticketsReducer from '../../store/ticketsSlice';
import usersReducer from '../../store/usersSlice';

describe('TicketDetails', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        tickets: ticketsReducer,
        users: usersReducer,
      },
      preloadedState: {
        tickets: {
          tickets: [],
          selectedTicket: {
            id: 1,
            description: 'Fix monitor arm',
            assigneeId: 1,
            completed: false,
          },
          loading: false,
          error: null,
          assigning: false,
          statusUpdating: false,
        },
        users: {
          users: [
            { id: 1, name: 'Bob' },
            { id: 2, name: 'Alice' },
          ],
          loading: false,
          error: null,
        },
      },
    });

    jest.spyOn(store, 'dispatch').mockImplementation((action) => action);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders ticket details correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <Routes>
            <Route path="/:id" element={<TicketDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    screen.debug();
    expect(screen.getByText(/fix monitor arm/i)).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});
