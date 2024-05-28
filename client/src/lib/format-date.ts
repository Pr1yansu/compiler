export const formatLocalDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString();
};
