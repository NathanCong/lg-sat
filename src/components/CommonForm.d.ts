interface FieldItem {
  key: string
  name: string
  label: string
  type: 'input' | 'textarea' | 'date' | 'dateRange' | 'select'
  value?: any
  defaultValue?: any
  rules?: Array<{ required?: boolean; message?: string }>
  options?: {
    placeholder?: string
    width?: string
    height?: string
    addonBefore?: string
    options?: Array<{ value: string; label: string }>
    allowClear?: boolean
    disabled?: boolean
  }
}

interface FieldRow {
  rowKey: string
  fieldCols: Array<FieldItem>
}

interface FormState {
  [key: string]: any
}
