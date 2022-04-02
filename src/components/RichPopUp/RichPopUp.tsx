import { ReactNode, CSSProperties, useState } from 'react'
import { Button } from 'react-bootstrap'

import './RichPopUp.css'

export interface RichPopUpProps {
  children: ReactNode
  text: ReactNode
  variant?: string
  className?: string
  style?: CSSProperties
}

export const RichPopUp = ({
  children,
  text,
  variant = 'light',
  className = '',
  style = {}
}: RichPopUpProps) => {
  const parentId = `rich-pop-up-${Math.round(Math.random() * 1000)}`
  const [show, setShow] = useState(false)

  const onToggleClick = (e: any) => {
    if (e.target.id === parentId) {
      setShow(!show)
    }
  }

  return (
    <div className='rich-popup'>
      <Button
        variant={ variant }
        className={ `btn-popup ${className}` }
        style={ style }
        id={ parentId }
        onClick={ onToggleClick }
      >
        { text }
      </Button>
      <div
        className='popup-content'
        style={{
          display: show ? 'block' : 'none'
        }}
      >
        { children }
      </div>
    </div>
  )
}
