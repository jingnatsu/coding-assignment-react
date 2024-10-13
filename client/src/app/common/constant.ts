export enum TICKET_STATUS {
  COMPLETE = 'completed',
  INCOMPLETE = 'incomplete',
}

export const UNASSIGNED = 'Unassigned';

export type TicketStatusFilterType =
  | 'all'
  | TICKET_STATUS.COMPLETE
  | TICKET_STATUS.INCOMPLETE;
