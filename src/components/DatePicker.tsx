import './DatePicker.css'

interface DatePickerProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  disabled?: boolean
}

export default function DatePicker({ label, value, onChange, required = false, disabled = false }: DatePickerProps) {
  return (
    <div className="date-picker">
      <label htmlFor="datePicker">{label}</label>
      <input
        type="date"
        id="datePicker"
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="date-input"
      />
    </div>
  )
}