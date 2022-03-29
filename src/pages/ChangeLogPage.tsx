import ReactMarkdown from "react-markdown"

export const ChangeLogPage = () => {
  const changes = `
  ## 2022.02.27
  - Remake in React
  `

  return (
    <>
      <h1>Change Log</h1>
      <ReactMarkdown children={changes} />
    </>
  )
}