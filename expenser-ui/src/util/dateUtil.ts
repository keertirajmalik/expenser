// const formatDate = (dateString: string): string => {
//   const [year, month, day] = dateString.split("-");
//   return `${day}/${month}/${year}`;
// };

const formatDate = (date: string): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
export { formatDate };
