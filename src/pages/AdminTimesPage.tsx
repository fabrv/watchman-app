import { useEffect, useMemo, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useTable } from 'react-table'
import { TimeLog, collections, User } from '../models/Api'
import { addToStorage } from '../services/storage'
import { getAll } from '../services/watchman'
import { toHours, toSeconds } from '../utils/time'
import { getUniquesFrom, nonStoredIds } from '../utils/utils'
import { ActionBar } from '../components/ActionBar/ActionBar'
import { FaFileExcel, FaFileCsv } from 'react-icons/fa'
import { TextAndTags } from '../components/Tags/TextAndTags'

interface TimeRow {
  user: any
  description: any
  time: any
  duration: string
  status: any
}

const statusTags = (finished: boolean, duration: number) => {
  return (
    finished
      ? <span className='tag' style={{ backgroundColor: 'var(--bs-primary-opaque)' }}>Finished</span>
      : ((duration / 3.6e6) < 8
          ? <span className='tag' style={{ backgroundColor: 'var(--bs-success-opaque)' }}>Running</span>
          : <span className='tag' style={{ backgroundColor: 'var(--bs-danger-opaque)' }}>Overtime</span>)
  )
}

const timeRow = (starTime: string, endTime: string, finished: boolean) => {
  const start = new Date(starTime).toLocaleString('en-GB')
  const end = finished ? new Date(endTime).toLocaleString('en-GB') : ''

  return (
    <div>
      <b>
        {start.substring(12, 17)} - {end.substring(12, 17)}
      </b><br/>
      {start.substring(0, 10)}
    </div>
  )
}

export interface AdminTimesPageProps {
  storage?: Storage
}

export const AdminTimesPage = ({ storage = sessionStorage }: AdminTimesPageProps) => {
  const [data, setData] = useState<TimeRow[]>([])
  const [users, setUsers] = useState<User[]>([])

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

  const retrieveData = async (filteredUserIds: number[] = []) => {
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
      filteredUserIds.length > 0 ? filteredUserIds : undefined,
      'user_ids'
    )

    const allIds =
      [...dict].map(([key, storageKey]) => {
        return getUniquesFrom(timeLogs, key)
          .filter(nonStoredIds(storageKey, storage))
      })

    const [users, projects, logTypes, teams] = await Promise.all(
      [...dict].map(async ([_, storageKey], index) => {
        return addToStorage(
          storageKey,
          await getAll<any>(storageKey, allIds[index].length, 0, allIds[index]),
          storage
        )
      }))

    setUsers(users)

    const result: TimeRow[] = timeLogs.map(timeLog => {
      const user = users.find(user => user.id === timeLog.user_id)
      const project = projects.find(project => project.id === timeLog.project_id)
      const logType = logTypes.find(logType => logType.id === timeLog.log_type_id)
      const team = teams.find(team => team.id === timeLog.team_id)
      return {
        user: TextAndTags(user?.name || '', [team?.name || '', project?.name || '']),
        project: project?.name || '',
        description: TextAndTags(timeLog.description || '', [logType.name || '']),
        time: timeRow(timeLog.start_time, timeLog.end_time, timeLog.finished),
        // Calc hours between start time and end time
        duration:
          toHours((new Date(timeLog.finished ? timeLog.end_time : new Date()).getTime() -
          new Date(timeLog.start_time).getTime()) / 1000),
        status: statusTags(
          timeLog.finished,
          (new Date(timeLog.finished ? timeLog.end_time : new Date()).getTime() - new Date(timeLog.start_time).getTime())
        )
      }
    })

    setData(result)
  }

  useEffect(() => {
    retrieveData()
  }, [])

  return (
    <>
      <h1>Time Logs</h1>
      <ActionBar
        exportOptions={[
          { id: 'csv', icon: FaFileCsv, name: 'CSV' },
          { id: 'excel', icon: FaFileExcel, name: 'Excel' }
        ]}
        filterOption={{ id: 'userIds', name: 'Users', data: users }}
        onExportClick={(id: string) => console.log(id)}
        onFilterValueChange={retrieveData}
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
