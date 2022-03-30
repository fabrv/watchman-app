import ReactMarkdown from 'react-markdown'
import ColorHash from 'color-hash'

export const TextAndTags = (text: string, tags: string[]) => {
  const colorHash = new ColorHash()
  return (
    <div>
      <ReactMarkdown>{text}</ReactMarkdown>
      {tags.map((tag, i) => {
        const [r, g, b] = colorHash.rgb(tag)
        return (
          <span key={i} className='tag' style={{ backgroundColor: `rgba(${r},${g},${b},0.6)` }}>{tag}</span>
        )
      })}
    </div>
  )
}
