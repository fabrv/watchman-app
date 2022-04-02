import { FC, ReactChild, useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { IconType } from 'react-icons'
import { FiDownload } from 'react-icons/fi'
import { FilterProps } from '../../models/FilterComponents'
import { Option } from '../../models/Option'

import './ActionBar.css'

export interface FilterOption {
  key: string
  props: FilterProps
  Component: FC<FilterProps>
}

interface ExportOption extends Option {
  icon: IconType
}

export interface ActionBarProps {
  filters: FilterOption[]
  exportOptions: ExportOption[]
  onChange: (filterValues: Record<string, any>) => void
  onExportClick: (clickedItem: string) => void
  children?: ReactChild
}

export const ActionBar = ({ filters, exportOptions, onChange, onExportClick, children }: ActionBarProps) => {
  const [filtersValue, setFiltersValue] = useState<Record<string, any>>({})

  const handleFilterValueChange = (key: string, value: any) => {
    const newFiltersValue = { ...filtersValue }
    newFiltersValue[key] = value
    setFiltersValue(newFiltersValue)
  }

  useEffect(() => {
    onChange(filtersValue)
  }, [filtersValue])

  return (
    <div className='action-bar'>
      {children}

      {
        filters.map(({ Component, key, props }) => {
          return (
            <Component key={key} {...props} onChange={(e) => handleFilterValueChange(key, e)}/>
          )
        })
      }

      <Dropdown>
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          <FiDownload/>
        </Dropdown.Toggle>

        <Dropdown.Menu variant='dark'>
          {exportOptions.map((option, i) => (
            <Dropdown.Item onClick={() => onExportClick(option.id.toString())} key={i}>
              <option.icon/> {' '}
              {option.value}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
