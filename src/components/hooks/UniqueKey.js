export const getUniqueKey = user => {
  if (!user) return `generated-${Math.random().toString(36).slice(2, 9)}`;
  if (user.id) return user.id;
  if (user.email) return `email-${user.email}`;
  return `generated-${Math.random().toString(36).slice(2, 9)}`;
};
