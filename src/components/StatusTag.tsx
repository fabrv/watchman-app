export const StatusTags = (finished: boolean, duration: number) => {
  return (
    finished
      ? <span className='tag' style={{ backgroundColor: 'var(--bs-primary-opaque)' }}>Finished</span>
      : ((duration / 3.6e6) < 8
          ? <span className='tag' style={{ backgroundColor: 'var(--bs-success-opaque)' }}>Running</span>
          : <span className='tag' style={{ backgroundColor: 'var(--bs-danger-opaque)' }}>Overtime</span>)
  )
}
