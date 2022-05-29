import { PageProps } from '../models/Page'

export const AdminTimesPage = ({ storage = sessionStorage, title = 'Time Logs' }: PageProps) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  )
}
