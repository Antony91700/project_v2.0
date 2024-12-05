const users = [];

export const getAllUsers = (req, res) => {
  res.json(users);
};

export const getUserById = (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};

export const createUser = (req, res) => {
  const user = {
    id: String(users.length + 1),
    ...req.body
  };
  users.push(user);
  res.status(201).json(user);
};