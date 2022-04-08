import { Form, InputGroup } from 'react-bootstrap'
import { FiSearch } from 'react-icons/fi'
import { FilterProps } from '../../models/FilterComponents'

import './InputFilter.css'

export const InputFilter = ({
  id,
  value,
  onChange,
  labels = {
    search: 'Search'
  }
}: FilterProps) => {
  return (
    <div className='input-filter'>
      <InputGroup>
        <InputGroup.Text><FiSearch/></InputGroup.Text>
        <Form.Control
          defaultValue={value}
          type='text'
          placeholder={`${labels.search} ${id}`}
          onChange={(e) => onChange(e.target.value)}
        />
      </InputGroup>
    </div>
  )
}
