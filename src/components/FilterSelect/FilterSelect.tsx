import { useEffect, useState } from 'react'
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap'
import { FiSearch, FiX } from 'react-icons/fi'
import { FilterProps } from '../../models/FilterComponents'
import { Option } from '../../models/Option'
import { Model } from '../../models/Api'

import './FilterSelect.css'

interface PopUpFilterProps {
  name: string
  data: any[]
  searchKey: string
  onCheck: (data: {value: number, checked: boolean}) => any
  show: boolean
  onHide: () => any
  labels: {
    hide: string
    search: string
  }
  displayedField?: string
}

const FilterTag = (option: Option, onClick: (e: number) => void) => (
  <div key={option.id} onClick={() => onClick(option.id as number)} className='tag filter-tag'>
    {option.value} {' '}
    <FiX/>
  </div>
)

const PopUpFilter = ({ name, data, searchKey, onCheck, show, onHide, labels, displayedField = 'name' }: PopUpFilterProps) => {
  const [searchField, setSearchField] = useState('')

  return (<div style={{
    borderRadius: '0.25rem',
    boxShadow: '0 0 7px 2px rgba(0,0,0,.1)',
    position: 'absolute',
    left: '0',
    top: '38px',
    minWidth: '200px',
    backgroundColor: '#FFF',
    display: show ? 'block' : 'none',
    zIndex: '10'
  }}>
    <ListGroup.Item>
      <InputGroup>
        <InputGroup.Text><FiSearch/></InputGroup.Text>
        <Form.Control
          type='text'
          placeholder={labels.search}
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        />
      </InputGroup>
    </ListGroup.Item>
    <ListGroup variant='flush' style={{ maxHeight: '200px', overflow: 'auto' }}>
      {data
        .filter(field => field[searchKey].toLowerCase().includes(searchField.toLowerCase()))
        .map(field => (
          <ListGroup.Item key={field.id}>
            <Form.Check
              name={name}
              type='checkbox'
              id={`default-${field.id}`}
              label={field[displayedField]}
              onChange={(e) => onCheck({ value: field.id, checked: e.target.checked })}
            />
          </ListGroup.Item>
        ))
      }
    </ListGroup>
    <ListGroup.Item>
      <Button onClick={() => onHide()}>{labels.hide}</Button>
    </ListGroup.Item>
  </div>)
}

export const FilterSelect = ({ id, caption, value, onChange, searchKey }: FilterProps) => {
  const [selectedFields, setSelectedFields] = useState<Option[]>([])
  const [searchData, setSearchData] = useState<any[]>([])
  const [showPopUp, setShowPopUp] = useState(false)

  useEffect(() => {
    const selectedIds = selectedFields.map(field => field.id)
    setSearchData(value.filter((f: Model) => !selectedIds.includes(f.id)))
  }, [value])

  const onFilterCheck = (e: {value: number, checked: boolean}) => {
    if (e.checked) {
      const selectedIds = selectedFields.map(field => field.id)
      setSelectedFields([...selectedFields, { id: e.value, value: value.find((f: Model) => f.id === e.value)[searchKey] }])
      setSearchData(searchData.filter(f => f.id !== e.value && !selectedIds.includes(f.id)))
    }
  }

  const onTagClick = (id: number) => {
    setSelectedFields(selectedFields.filter(field => field.id !== id))
    setSearchData([...searchData, value.find((f: Model) => f.id === id)])
  }

  useEffect(() => {
    onChange(selectedFields.map(field => field.id as number))
  }, [selectedFields])

  const onFilterSelectClick = (event: any) => {
    if (event.target.id === 'filter-select') {
      setShowPopUp(!showPopUp)
    }
  }

  return (
    <div className='filter-select' style={{ position: 'relative' }}>
      <Button
        variant='light'
        className='btn-popup'
        id='filter-select'
        onClick={onFilterSelectClick}
      >
        {selectedFields.map(field => FilterTag(field, onTagClick))}
        {selectedFields.length < 1 && caption}
      </Button>
      <PopUpFilter
        name={id}
        data={searchData}
        searchKey={searchKey}
        onCheck={onFilterCheck}
        show={showPopUp}
        onHide={() => setShowPopUp(false)}
        labels={{
          hide: 'Close',
          search: 'Search'
        }}
      />
    </div>
  )
}
