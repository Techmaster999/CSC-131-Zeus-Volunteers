import { mockReminders } from "../utils/mockDB.js";

export const createReminder = (req, res) => {
  const newReminder = {
    id: mockReminders.length + 1,
    ...req.body,
  };
  mockReminders.push(newReminder);
  res.json(newReminder);
};

export const getReminders = (req, res) => {
  res.json(mockReminders);
};
