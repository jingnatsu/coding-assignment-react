import { render, screen, fireEvent } from '@testing-library/react';
import Tickets from './tickets';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

const mockStore = configureStore([]);
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

describe('Tickets', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      tickets: {
        tickets: [
          {
            id: 1,
            description: 'Fix monitor arm',
            assigneeId: 1,
            completed: false,
          },
          {
            id: 2,
            description: 'Replace keyboard',
            assigneeId: null,
            completed: true,
          },
        ],
        loading: false,
        error: null,
      },
      users: {
        users: [
          { id: 1, name: 'Bob' },
          { id: 2, name: 'Alice' },
        ],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders tickets correctly', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <Tickets />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Fix monitor arm')).toBeInTheDocument();
    expect(screen.getByText('Replace keyboard')).toBeInTheDocument();
  });
});
