import { useEffect, useMemo, useState } from "react"
import { Table } from "react-bootstrap"
import { useTable } from 'react-table'
import { TimeLog, collections } from "../models/Api"
import { addToStorage } from "../services/storage"
import { getAll } from "../services/watchman"
import { toHours, toSeconds } from "../utils/time"
import { getUniquesFrom, nonStoredIds } from "../utils/utils"

interface TimeRow {
  user: string
  project: string
  tasktype: string
  team: string
  description: string
  start_time: string
  end_time: string
  time: string
}

export interface AdminTimesPageProps {
  storage?: Storage
}

export const AdminTimesPage = ({storage = localStorage}: AdminTimesPageProps) => {
  const [data, setData] = useState<TimeRow[]>([])

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
        Header: 'Project',
        accessor: 'project' as keyof TimeRow,
      },
      {
        Header: 'Team',
        accessor: 'team' as keyof TimeRow,
      },
      {
        Header: 'Task',
        accessor: 'tasktype' as keyof TimeRow,
      },
      {
        Header: 'Description',
        accessor: 'description' as keyof TimeRow,
      },
      {
        Header: 'Start',
        accessor: 'start_time' as keyof TimeRow,
      },
      {
        Header: 'End',
        accessor: 'end_time' as keyof TimeRow,
      },
      {
        Header: 'Time',
        accessor: 'time' as keyof TimeRow,
        Footer: (info: { rows: { values: TimeRow }[] }) => {
          const total = useMemo(
            () => info.rows
              .map((a: { values: TimeRow }) => {return toSeconds(a.values.time)})
              .reduce((sum: number, row: number) => sum + row, 0),
            [info.rows]
          )
          return <>Total: {toHours(total)}</>
        }
      }
    ],
    []
  )

  const {
    headerGroups,
    rows,
    prepareRow,
    footerGroups,
  } = useTable({ columns, data })

  useEffect(() => {
    const retrieveData = async () => {
      const dict: [string, collections][] = [
        ['user_id', 'users']
        , ['project_id', 'projects']
        , ['log_type_id', 'log-types']
        , ['team_id', 'teams']
      ]
      const timeLogs = await getAll<TimeLog>('time-logs')
  
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

      const result: TimeRow[] = timeLogs.map(timeLog => {
        const user = users.find(user => user.id === timeLog.user_id)
        const project = projects.find(project => project.id === timeLog.project_id)
        const logType = logTypes.find(logType => logType.id === timeLog.log_type_id)
        const team = teams.find(team => team.id === timeLog.team_id)
        return {
          user: user ? user.name : '',
          project: project ? project.name : '',
          tasktype: logType ? logType.name : '',
          team: team ? team.name : '',
          description: timeLog.description,
          start_time: new Date(timeLog.start_time).toLocaleString(),
          end_time: timeLog.finished ? new Date(timeLog.end_time).toLocaleString() : '-',
          // Calc hours between start time and end time
          time: 
            toHours((new Date(timeLog.finished ? timeLog.end_time : new Date()).getTime() 
            - new Date(timeLog.start_time).getTime()) / 1000),
        }
      })

      setData(result)
    }
    retrieveData()
  }, [storage])

  return (
    <>
      <h1>Times</h1>
      <Table variant="dark" responsive>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr>
              {headerGroup.headers.map((column, index) => (
                <th key={index}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr>
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
          {footerGroups.map(group => (
            <tr>
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