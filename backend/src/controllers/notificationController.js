import { mockNotifications } from "../utils/mockDB.js";

export const createNotification = (req, res) => {
  const newNote = {
    id: mockNotifications.length + 1,
    ...req.body,
  };
  mockNotifications.push(newNote);
  res.json(newNote);
};

export const getNotifications = (req, res) => {
  res.json(mockNotifications);
};
