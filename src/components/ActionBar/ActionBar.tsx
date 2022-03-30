import { ReactChild } from 'react'
import { Dropdown } from 'react-bootstrap'
import { IconType } from 'react-icons'
import { FiDownload } from 'react-icons/fi'
import { Option } from '../../models/Option'
import { FilterSelect } from '../FilterSelect/FilterSelect'

import './ActionBar.css'

interface FilterOption extends Option {
  data: any[]
}

interface ExportOption extends Option {
  icon: IconType
}

export interface ActionBarProps {
  filterOption: FilterOption
  exportOptions: ExportOption[]
  onFilterValueChange: (selectedIds: number[]) => void
  onExportClick: (clickedItem: string) => void
  children?: ReactChild
}

export const ActionBar = ({ filterOption, exportOptions, onFilterValueChange, onExportClick, children }: ActionBarProps) => {
  return (
    <div className='action-bar'>
      {children}

      <FilterSelect
        name={filterOption.id.toString()}
        caption={`Filter ${filterOption.name}`}
        data={filterOption.data}
        onChange={onFilterValueChange}
      />

      <Dropdown>
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          <FiDownload/>
        </Dropdown.Toggle>

        <Dropdown.Menu variant='dark'>
          {exportOptions.map((option, i) => (
            <Dropdown.Item onClick={() => onExportClick(option.id.toString())} key={i}>
              <option.icon/> {' '}
              {option.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
