import { ReactNode } from 'react'

export interface FilterProps {
  id: string
  value?: any
  caption?: ReactNode
  labels?: Record<string, string>
  onChange: (value: any) => void
  [key: string]: any
}
