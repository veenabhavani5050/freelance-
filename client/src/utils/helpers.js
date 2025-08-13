// src/utils/helpers.js
export const getInitials = (name) => {
  if (!name) return 'U'; // 'U' for unknown user
  const nameParts = name.split(' ').filter(part => part.length > 0);
  if (nameParts.length > 1) {
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  }
  return nameParts[0][0].toUpperCase();
};