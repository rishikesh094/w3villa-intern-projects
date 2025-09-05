import { PRIORITIES, STATUSES } from '../constants/taskConstants';

export const getPriorityStyle = (priority) => {
  const style = PRIORITIES.find(p => p.value === priority);
  return style ? style.color : 'text-gray-600 bg-gray-100';
};

export const getStatusStyle = (status) => {
  const style = STATUSES.find(s => s.value === status);
  return style ? style.color : 'text-gray-600 bg-gray-100';
};

export const getStatusLabel = (status) => {
  const statusObj = STATUSES.find(s => s.value === status);
  return statusObj ? statusObj.label : status;
};

export const getStatusIcon = (status) => {
  const statusObj = STATUSES.find(s => s.value === status);
  return statusObj ? statusObj.icon : 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
};

export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
};

export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getTasksByStatus = (tasks, status) => {
  return tasks.filter(task => task.status === status);
};
