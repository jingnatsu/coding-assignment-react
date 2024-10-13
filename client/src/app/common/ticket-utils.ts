import { User } from '@acme/shared-models';
import { TICKET_STATUS, UNASSIGNED } from './constant';

export const getTicketStatusValue = (isCompleted: boolean) =>
  isCompleted ? TICKET_STATUS.COMPLETE : TICKET_STATUS.INCOMPLETE;

export const getTicketStatusLabel = (isCompleted: boolean) =>
  isCompleted ? 'Complete' : 'Incomplete';

export const getAssigneeName = (
  assigneeId: number | null | undefined,
  users: User[]
) => {
  if (!assigneeId) {
    return UNASSIGNED;
  }
  const user = users.find((user) => user.id === assigneeId);
  return user ? user.name : 'Unknown';
};
