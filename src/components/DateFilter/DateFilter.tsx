import { useState } from 'react'
import { Col, Container, Pagination, Row } from 'react-bootstrap'
import { FiCalendar } from 'react-icons/fi'
import { FilterProps } from '../../models/FilterComponents'
import { RichPopUp } from '../RichPopUp/RichPopUp'

import './DateFilter.css'

export const DateFilter = ({
  value = { from: new Date(new Date().getTime() - (60 * 60 * 24 * 7 * 1000)), to: new Date() },
  onChange,
  labels = {
    thisWeek: 'This Week',
    lastWeek: 'Last Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    thisYear: 'This Year',
    lastYear: 'Last Year'
  }
}: FilterProps) => {
  const presets = [
    {
      label: labels.thisWeek,
      startDate: new Date(new Date().getTime() - (60 * 60 * 24 * 7 * 1000)),
      endDate: new Date()
    },
    {
      label: labels.lastWeek,
      startDate: new Date(new Date().getTime() - (60 * 60 * 24 * 14 * 1000)),
      endDate: new Date(new Date().getTime() - (60 * 60 * 24 * 7 * 1000))
    },
    {
      label: labels.thisMonth,
      startDate: new Date(new Date().getTime() - (60 * 60 * 24 * 30 * 1000)),
      endDate: new Date()
    },
    {
      label: labels.lastMonth,
      startDate: new Date(new Date().getTime() - (60 * 60 * 24 * 60 * 1000)),
      endDate: new Date(new Date().getTime() - (60 * 60 * 24 * 30 * 1000))
    },
    {
      label: labels.thisYear,
      startDate: new Date(new Date().getTime() - (60 * 60 * 24 * 365 * 1000)),
      endDate: new Date()
    },
    {
      label: labels.lastYear,
      startDate: new Date(new Date().getTime() - (60 * 60 * 24 * 365 * 1000 * 2)),
      endDate: new Date(new Date().getTime() - (60 * 60 * 24 * 365 * 1000))
    }
  ]

  const [currentStartDate, setCurrentStartDate] = useState(value.from.toISOString().split('T')[0])
  const [currentEndDate, setCurrentEndDate] = useState(value.to.toISOString().split('T')[0])
  const [label, setLabel] = useState(presets[0].label)
  const [selectedPreset, setSelectedPreset] = useState(0)

  const handlePresetChange = (preset: number) => {
    setSelectedPreset(preset)
    setLabel(presets[preset].label)
    onChange({ from: presets[preset].startDate, to: presets[preset].endDate })
    setCurrentStartDate(presets[preset].startDate.toISOString().split('T')[0])
    setCurrentEndDate(presets[preset].endDate.toISOString().split('T')[0])
  }

  const onCustomDateChange = (startDate: string, endDate: string) => {
    onChange({ from: new Date(startDate), to: new Date(endDate) })
    setCurrentStartDate(startDate)
    setCurrentEndDate(endDate)
    setSelectedPreset(-1)
    setLabel(
      new Date(startDate).toLocaleString('en-GB').substring(0, 10) +
      ' - ' +
      new Date(endDate).toLocaleString('en-GB').substring(0, 10)
    )
  }

  return (
    <RichPopUp
      text={<>
        <FiCalendar/>{' '}{label}
      </>}
    >
      <div className="date-filter">
        <Pagination size="sm" className="justify-content-center">
          {presets.map((preset, i) => (
            <Pagination.Item style={{ textAlign: 'center' }} onClick={() => handlePresetChange(i)} key={i} active={i === selectedPreset}>
              {preset.label}
            </Pagination.Item>
          ))}
        </Pagination>
        <Container>
          <Row>
            <Col>
              <span style={{ color: 'var(--bs-dark)' }}>Start date:</span>
              <input
                type='date'
                value={currentStartDate}
                onChange={(e) => onCustomDateChange(e.target.value, currentEndDate)}
              />
            </Col>
            <Col style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--bs-dark)' }}>End date:</span>
              <input
                type='date'
                value={currentEndDate}
                onChange={(e) => onCustomDateChange(currentStartDate, e.target.value)}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </RichPopUp>
  )
}
