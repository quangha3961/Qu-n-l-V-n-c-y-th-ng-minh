import { styled } from "@mui/material";
import { DatePicker as OriginalDatePicker } from "@mui/x-date-pickers";

const DatePicker = styled(OriginalDatePicker)(() => ({
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiOutlinedInput-root": {
    width: "150px",
  },
  "& *": {
    color: "var(--light-grey)",
  },
}));

export default DatePicker;
