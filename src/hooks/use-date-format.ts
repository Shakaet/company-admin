import { format } from "date-fns";
export function DateFormat(date: string | Date) {
  if (!date) return "";

  return format(date, "dd-MM-yyyy");
}
