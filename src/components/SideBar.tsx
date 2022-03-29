import { useState } from "react"
import { Button, Nav } from "react-bootstrap"
import { IconType } from "react-icons"
import { FiMenu } from "react-icons/fi"

export interface SideBarProps {
  onSelect: (event: string | null) => any
  activeKey?: string
  data: {
    groups: {
      name: string
      items: {
        icon: IconType
        name: string
        url: string
        active: boolean
      }[]
    }[]
  }
}

export const SideBar = ({data, onSelect, activeKey}: SideBarProps) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Nav 
      onSelect={(e) => onSelect(e)}
      defaultActiveKey="/" 
      activeKey={activeKey} 
      variant="pills" 
      className="flex-column sidebar sidebar-sticky collapsible-sidebar"
      style={collapsed ? { height: "100vh", overflowY: 'auto' } : {}}
    >
      <Button className="sidebar-toggler" variant="outline-light" onClick={()=>{setCollapsed(!collapsed)}}>
        <FiMenu/>
      </Button>
      {data.groups.map((group, index) => {
        return (
          <div key={index}>
          <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>{group.name}</span>
          </h6>
          {
            group.items.map((item, index) => {
              return (
                <Nav.Link 
                  key={index} 
                  eventKey={item.url}
                  onClick={() => {setCollapsed(false)}}
                >
                  <span style={{marginRight: '20px'}}><item.icon /></span>
                  {item.name}
                </Nav.Link>
              )
            })
          }
          </div>
        )}
      )}
    </Nav>
  )
}