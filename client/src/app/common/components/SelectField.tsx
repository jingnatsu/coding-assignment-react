import { ChangeEvent, memo } from 'react';
import { InputLabel, NativeSelect } from '@mui/material';

interface SelectFieldProps {
  label: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
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
  <>
    <InputLabel variant="standard" htmlFor={`uncontrolled-native-${label}`}>
      {label}
    </InputLabel>
    <NativeSelect
      id={`uncontrolled-native-${label}`}
      defaultValue={value}
      onChange={onChange}
      disabled={disabled}
      inputProps={{
        name: `${label}`,
        id: `uncontrolled-native-${label}`,
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </NativeSelect>
  </>
);

export default memo(SelectField);
