import { format, parseISO } from "date-fns";

function extractDate(timestamp) {
  if (!timestamp) return "";
  const date = parseISO(timestamp);
  return format(date, "yyyy-MM-dd");
}

export default extractDate;
