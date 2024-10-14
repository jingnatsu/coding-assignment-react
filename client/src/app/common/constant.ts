export enum TICKET_STATUS {
  COMPLETE = 'completed',
  INCOMPLETE = 'incomplete',
}

export const UNASSIGNED = 'Unassigned';
export const UNASSIGNED_ID = -1;

export type TicketStatusFilterType =
  | 'all'
  | TICKET_STATUS.COMPLETE
  | TICKET_STATUS.INCOMPLETE;

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: TICKET_STATUS.INCOMPLETE, label: 'Incomplete' },
  { value: TICKET_STATUS.COMPLETE, label: 'Completed' },
];
