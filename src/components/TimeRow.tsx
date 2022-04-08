export const timeRow = (starTime: string, endTime: string, finished: boolean) => {
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
