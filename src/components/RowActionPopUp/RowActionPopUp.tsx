import { Dropdown } from 'react-bootstrap'
import { FiMoreVertical } from 'react-icons/fi'
import { Option } from '../../models/Option'
import { IconType } from 'react-icons'

import './RowActionPopUp.css'

export interface RowActionOption extends Option {
  color?: string
  icon?: IconType
}

interface RowActionPopUpProps {
  onClick: (id: string) => void
  options: RowActionOption[]
}

export const RowActionPopUp = (props: RowActionPopUpProps) => {
  return (
    <>
    <Dropdown>
      <Dropdown.Toggle variant="dark" className='btn-row-action-pop-up'>
        <FiMoreVertical/>
      </Dropdown.Toggle>

      <Dropdown.Menu variant='dark'>
        {props.options.map((option, i) => (
          <Dropdown.Item key={i} onClick={() => props.onClick(option.id.toString())}>
            {option.icon && <option.icon style={{ marginRight: '0.5rem' }}/>}
            {option.value}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
    </>
  )
}
