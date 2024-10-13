import { memo } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface SelectFieldProps {
  label: string;
  value: string | number;
  onChange: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void;
  disabled?: boolean;
  options: { value: string | number; label: string }[];
}

const SelectField = ({
  label,
  value,
  onChange,
  disabled = false,
  options,
}: SelectFieldProps) => (
  <FormControl fullWidth margin="normal">
    <InputLabel>{label}</InputLabel>
    <Select value={value} onChange={onChange} disabled={disabled}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default memo(SelectField);
