import { PageProps } from '../models/Page'

export const AdminUsersPage = ({ storage = sessionStorage, title = 'Users' }: PageProps) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  )
}
