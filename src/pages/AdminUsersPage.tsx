import { useEffect, useMemo, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useTable } from 'react-table'
import { getAll } from '../services/watchman'
// import { ActionBar } from '../components/ActionBar/ActionBar'
// import { FaFileExcel, FaFileCsv } from 'react-icons/fa'
import { FiEdit2, FiTrash } from 'react-icons/fi'
import { RowActionPopUp, RowActionOption } from '../components/RowActionPopUp/RowActionPopUp'
import { User } from '../models/Api'
import { PageProps } from '../models/Page'

interface TimeRow {
  user: any
  role: any
  createdAt: any
}

export const AdminUsersPage = ({ storage = sessionStorage, title = 'Users' }: PageProps) => {
  const [data, setData] = useState<TimeRow[]>([])
  const [, setUsers] = useState<User[]>([])

  const editOptions: RowActionOption[] = [
    {
      id: 'edit',
      value: 'Edit',
      color: '#007bff',
      icon: FiEdit2
    },
    {
      id: 'delete',
      value: 'Delete',
      color: '#dc3545',
      icon: FiTrash
    }
  ]

  const columns = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'user' as keyof TimeRow,
        Footer: (info: { rows: { values: TimeRow }[] }) => {
          const total = useMemo(
            () => info.rows
              .reduce((acc, _) => acc + 1, 0),
            [info.rows]
          )
          return <>Count: {total}</>
        }
      },
      {
        Header: 'Role',
        accessor: 'role' as keyof TimeRow
      },
      {
        Header: 'Created At',
        accessor: 'createdAt' as keyof TimeRow
      }
    ],
    []
  )

  const {
    headerGroups,
    rows,
    prepareRow,
    footerGroups
  } = useTable({ columns, data })

  const retrieveData = async (ids: number[] = []) => {
    const allUsers = await getAll<User>(
      'users',
      100,
      0,
      ids.length > 0 ? ids : undefined
    )

    setUsers(allUsers)

    const result: TimeRow[] = allUsers.map(user => {
      return {
        user: user.name + ' ' + user.email,
        role: user.role.name,
        createdAt: user.created_at
      }
    })

    setData(result)
  }

  useEffect(() => {
    retrieveData()
  }, [])

  return (
    <>
      <h1>{title}</h1>
      {/* <ActionBar
        exportOptions={[
          { id: 'csv', icon: FaFileCsv, value: 'CSV' },
          { id: 'excel', icon: FaFileExcel, value: 'Excel' }
        ]}
        filterOption={{ id: 'userIds', value: 'Users', data: users }}
        onExportClick={(id: string) => console.log(id)}
        onChange={retrieveData}
      /> */}
      <Table variant="dark" responsive>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr key={i}>
              {headerGroup.headers.map((column, index) => (
                <th key={index}>
                  {column.render('Header')}
                </th>
              ))}
              <th style={{ width: '1.5rem' }}></th>
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr key={i}>
                {row.cells.map((cell, index) => {
                  return (
                    <td key={index}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
                <td>
                  <RowActionPopUp onClick={(e) => console.log(e)} options={editOptions} />
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          {footerGroups.map((group, i) => (
            <tr key={i}>
              {group.headers.map((column, index) => (
                <td key={index}>{column.render('Footer')}</td>
              ))}
            </tr>
          ))}
        </tfoot>
      </Table>
    </>
  )
}
