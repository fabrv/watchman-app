import { useEffect, useMemo, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useTable } from 'react-table'
import { TimeLog, collections, User } from '../models/Api'
import { addToStorage } from '../services/storage'
import { getAll } from '../services/watchman'
import { toHours, toSeconds } from '../utils/time'
import { getUniquesFrom, nonStoredIds } from '../utils/utils'
// import { FaFileExcel, FaFileCsv } from 'react-icons/fa'
// import { FiEdit2 } from 'react-icons/fi'
import { timeRow } from '../components/TimeRow'
import { PageProps } from '../models/Page'

interface TimeRow {
  user: any
  description: any
  time: any
  duration: string
  status: any
}

export const AdminTimesPage = ({ storage = sessionStorage, title = 'Time Logs' }: PageProps) => {
  const [data, setData] = useState<TimeRow[]>([])
  const [, setUsers] = useState<User[]>([])

  const [usersFilter] = useState<number[]>([])
  const [dateFilter] = useState<{from: Date, to: Date}>({ from: new Date(new Date().getTime() - (60 * 60 * 24 * 7 * 1000)), to: new Date() })

  // const filterOptions: FilterOption[] = [
  //   {
  //     Component: DateFilter,
  //     key: 'date',
  //     props: {
  //       id: 'date',
  //       onChange: () => undefined
  //     }
  //   },
  //   {
  //     Component: SelectFilter,
  //     key: 'userIds',
  //     props: {
  //       id: 'users',
  //       onChange: () => undefined,
  //       caption: <><FiFilter/> Users</>,
  //       value: users,
  //       searchKey: 'name'
  //     }
  //   }
  // ]

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
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
        Header: 'Task',
        accessor: 'description' as keyof TimeRow
      },
      {
        Header: 'time',
        accessor: 'time' as keyof TimeRow
      },
      {
        Header: 'Duration',
        accessor: 'duration' as keyof TimeRow,
        Footer: (info: { rows: { values: TimeRow }[] }) => {
          const total = useMemo(
            () => info.rows
              .map((a: { values: TimeRow }) => { return toSeconds(a.values.duration) })
              .reduce((sum: number, row: number) => sum + row, 0),
            [info.rows]
          )
          return <span style={{ fontWeight: '900' }}>{toHours(total)}</span>
        }
      },
      {
        Header: 'Status',
        accessor: 'status' as keyof TimeRow
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

  const retrieveData = async (userIds: number[], from: Date, to: Date) => {
    const dict: [string, collections][] = [
      ['user_id', 'users'],
      ['project_id', 'projects'],
      ['log_type_id', 'log-types'],
      ['team_id', 'teams']
    ]
    const timeLogs = await getAll<TimeLog>(
      'time-logs',
      100,
      0,
      userIds.length > 0 ? userIds : undefined,
      'user_ids',
      { from, to }
    )

    const allIds =
      [...dict].map(([key, storageKey]) => {
        return getUniquesFrom(timeLogs, key)
          .filter(nonStoredIds(storageKey, storage))
      })

    const [users, projects] = await Promise.all(
      [...dict].map(async ([_, storageKey], index) => {
        return addToStorage(
          storageKey,
          await getAll<any>(storageKey, allIds[index].length, 0, allIds[index]),
          storage
        )
      }))

    setUsers(users)

    const result: TimeRow[] = timeLogs.map(timeLog => {
      // const user = users.find(user => user.id === timeLog.user_id)
      const project = projects.find(project => project.id === timeLog.project_id)
      // const logType = logTypes.find(logType => logType.id === timeLog.log_type_id)
      // const team = teams.find(team => team.id === timeLog.team_id)
      return {
        // user: TextAndTags(user?.name || '', [team?.name || '', project?.name || '']),
        user: '',
        project: project?.name || '',
        // description: TextAndTags(timeLog.description || '', [logType.name || '']),
        description: '',
        time: timeRow(timeLog.start_time, timeLog.end_time, timeLog.finished),
        // Calc hours between start time and end time
        duration:
          toHours((new Date(timeLog.finished ? timeLog.end_time : new Date()).getTime() -
          new Date(timeLog.start_time).getTime()) / 1000),
        // status: StatusTags(
        //   timeLog.finished,
        //   (new Date(timeLog.finished ? timeLog.end_time : new Date()).getTime() - new Date(timeLog.start_time).getTime())
        // )
        status: ''
      }
    })

    setData(result)
  }

  // const handleFilterChange = (e: Record<string, any>) => {
  //   const userIds: number[] = e.userIds || []
  //   const date: { from: Date, to: Date } = e.date || dateFilter

  //   setDateFilter(date)
  //   setUsersFilter(userIds)
  // }

  useEffect(() => {
    retrieveData(usersFilter, dateFilter?.from, dateFilter?.to)
  }, [dateFilter, usersFilter.length])

  return (
    <>
      <h1>{title}</h1>

      {/* <ActionBar
        onChange={handleFilterChange}
        exportOptions={[
          { id: 'csv', icon: FaFileCsv, value: 'CSV' },
          { id: 'excel', icon: FaFileExcel, value: 'Excel' }
        ]}
        filters={filterOptions}
        showNew={false}
        onExportClick={(id: string) => console.log(id)}
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
                  {/* <RowActionPopUp onClick={(e) => console.log(e)} options={[{ id: 0, value: 'Edit', icon: FiEdit2 }]} /> */}
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
