import { Button, Form } from 'react-bootstrap'
import { Option } from '../models/Option'

export interface TrackPageProps {
  lastTimeLog?: any
  todaysTimeLogs?: any
  onSubmit?: (timeLog: any) => void
  labels: {
    project: string
    type: string
    description: string
    track: string
  }
  availableProjects: Option[]
  availableTypes: Option[]
}

export const TrackPage = (props: TrackPageProps) => {
  return (
    <>
      <h1>{props.labels.track}</h1>

      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>{props.labels.project}</Form.Label>
          <Form.Select className='bg-dark text-light'>
            {props.availableProjects.map((project: any) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>{props.labels.type}</Form.Label>
          <Form.Select className='bg-dark text-light'>
            {props.availableTypes.map((type: any) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>{props.labels.description}</Form.Label>
          <Form.Control
            className='bg-dark text-light'
            as='textarea'>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          {props.labels.track}
        </Button>
      </Form>
    </>
  )
}
