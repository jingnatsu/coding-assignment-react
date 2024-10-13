import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddTicketModal from './add-ticket';

const mockStore = configureStore([]);

describe('AddTicketModal', () => {
  let store: any;
  const onClose = jest.fn();

  beforeEach(() => {
    store = mockStore({
      tickets: { loading: false, error: null },
    });
  });

  it('renders add ticket modal', () => {
    render(
      <Provider store={store}>
        <AddTicketModal open={true} onClose={onClose} />
      </Provider>
    );

    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add ticket/i })
    ).toBeInTheDocument();
  });
});
