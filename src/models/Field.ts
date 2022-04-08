import { Option } from './Option'

export interface Field {
  name: string
  value: string
  label: string
  placeholder?: string
  type: 'text' | 'number' | 'date' | 'select' | 'password'
  options?: Option[]
  required?: boolean
}
