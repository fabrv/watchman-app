export interface FilterProps {
  id: string
  value?: any
  caption?: string
  labels?: Record<string, string>
  onChange: (value: any) => void
  [key: string]: any
}
