import { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { FiX } from 'react-icons/fi'
import { ReactNode } from 'react-markdown/lib/ast-to-react'
import { Field } from '../../models/Field'

import './FormModal.css'

export interface FormModalProps {
  title: string
  fields: Field[]
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | undefined
  show: boolean
  validated?: boolean
  labels?: Record<string, string>
  onSubmit: (values: any) => void
}

export const FormModal = ({
  title,
  fields,
  children,
  variant,
  show,
  validated = false,
  labels = {
    submit: 'Submit',
    cancel: 'Cancel',
    invalidFieldValue: 'Invalid field value'
  },
  onSubmit
}: FormModalProps) => {
  const [showVal, setShowVal] = useState(show)
  const [validatedVal, setValidatedVal] = useState(validated)
  const uniqueId = `form-modal-${Math.round(Math.random() * 1000)}`
  const values: Record<string, any> = {}

  useEffect(() => {
    setShowVal(show)
  }, [show])

  const handleClose = () => {
    setShowVal(false)
    setValidatedVal(false)
  }

  const handleChange = (e: any) => {
    values[e.target.name] = e.target.value
  }

  const handleSubmit = () => {
    const form = document.getElementById(uniqueId) as HTMLFormElement
    const formIsValid = form.checkValidity()

    console.log(formIsValid)

    if (formIsValid) {
      onSubmit(values)
      setShowVal(false)
    } else {
      setValidatedVal(true)
    }
  }

  const mapField = (field: Field, onChange: (e: any) => void) => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
      case 'password':
        return <Form.Control
                className='form-control-dark'
                onChange={onChange}
                defaultValue={field.value}
                key={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                placeholder={field.placeholder || field.label}
              />
      case 'select':
        return (
          <Form.Select className='form-control-dark' name={field.name} onChange={onChange}>
            {
              field.options?.map(option => (
                <option key={option.id} value={option.id}>{option.value}</option>
              ))
            }
          </Form.Select>
        )
    }
  }

  return (
    <div className='form-modal'>
      <Button variant={variant} onClick={() => setShowVal(true)}>
        {children}
      </Button>

      <Modal show={showVal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
          <Button onClick={handleClose} variant='dark'>
            <FiX/>
          </Button>
        </Modal.Header>

        <Modal.Body>
          <Form id={uniqueId} noValidate validated={validatedVal}>
            {
              fields.map(field => (
                <Form.Group className='form-group' key={field.name}>
                  <Form.Label>{field.label}</Form.Label>
                  {mapField(field, handleChange)}
                  <Form.Control.Feedback type="invalid">
                    {labels.invalidFieldValue}
                  </Form.Control.Feedback>
                </Form.Group>
              ))
            }
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="dark" onClick={handleClose}>
            {labels.cancel}
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {labels.submit}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
