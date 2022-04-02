import { useEffect, useMemo, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useTable } from 'react-table'
import { getAll } from '../services/watchman'
import { FaFileExcel, FaFileCsv } from 'react-icons/fa'
import { FiEdit2, FiFilter, FiTrash } from 'react-icons/fi'
import { RowActionPopUp, RowActionOption } from '../components/RowActionPopUp/RowActionPopUp'
import { User, Role } from '../models/Api'
import { PageProps } from '../models/Page'
import { TextAndTags } from '../components/Tags/TextAndTags'
import { ActionBar, FilterOption } from '../components/ActionBar/ActionBar'
import { SelectFilter } from '../components/SelectFilter/SelectFilter'
import { addToStorage } from '../services/storage'
import { InputFilter } from '../components/InputFilter/InputFilter'

interface TimeRow {
  user: any
  createdAt: any
}

export const AdminUsersPage = ({ storage = sessionStorage, title = 'Users' }: PageProps) => {
  const [data, setData] = useState<TimeRow[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([])
  const [search, setSearch] = useState<string>('')
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

  const retrieveRoles = async () => {
    const allRoles = await getAll<Role[]>('roles', 1000, 0)

    setRoles(allRoles)
  }

  const retrieveData = async (roleIds: number[] = [], searchField: string) => {
    const allUsers = await getAll<User>(
      'users',
      100,
      0,
      roleIds.length > 0 ? roleIds : undefined,
      'role_ids',
      { textSearch: { field: 'name', value: searchField } }
    )

    addToStorage('users', allUsers, storage)
    setUsers(allUsers)

    const result: TimeRow[] = allUsers.map(user => {
      return {
        user: TextAndTags(`**${user.name}** (${user.email})`, [user.role.name]),
        createdAt: new Date(user.created_at).toLocaleString('en-GB').substring(0, 10)
      }
    })

    setData(result)
  }

  useEffect(() => {
    retrieveData(selectedRoleIds, search)
  }, [selectedRoleIds.length, search])

  useEffect(() => {
    retrieveRoles()
  }, [])

  const handleFilterChange = (filters: Record<string, any>) => {
    const roles: number[] = filters.role || []
    setSearch(filters.user || '')
    setSelectedRoleIds(roles)
  }

  const filters: FilterOption[] = [
    {
      Component: InputFilter,
      key: 'user',
      props: {
        id: 'user',
        value: '',
        onChange: () => undefined
      }
    },
    {
      Component: SelectFilter,
      key: 'role',
      props: {
        id: 'role',
        value: roles,
        caption: <><FiFilter/> Roles</>,
        searchKey: 'name',
        onChange: () => undefined
      }
    }
  ]

  return (
    <>
      <h1>{title}</h1>
      <ActionBar
        exportOptions={[
          { id: 'csv', icon: FaFileCsv, value: 'CSV' },
          { id: 'excel', icon: FaFileExcel, value: 'Excel' }
        ]}
        filters={filters}
        onExportClick={(id: string) => console.log(id)}
        onChange={handleFilterChange}
      />
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
