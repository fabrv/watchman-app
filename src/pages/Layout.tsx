import { Col, Container, Row} from 'react-bootstrap';
import { TopBar } from '../components/TopBar';

import { SideBar, SideBarProps } from '../components/SideBar';

import { FiActivity, FiBriefcase, FiHome, FiInfo, FiList, FiUsers} from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

export interface LayoutProps {
  children: React.ReactNode
}

const menuItems = {
  groups: [
    {
      name: 'Home',
      items: [
        {
          icon: FiHome,
          name: 'Track',
          url: '/',
          active: true
        },
        {
          icon: FiUsers,
          name: 'Team',
          url: '/team',
          active: true
        },
        {
          icon: FiActivity,
          name: 'Projects',
          url: '/projects',
          active: true
        },
        {
          icon: FiInfo,
          name: 'Change Log',
          url: '/changelog',
          active: true
        }
      ]
    },
    {
      name: 'Admin',
      items: [
        {
          icon: FiUsers,
          name: 'Users',
          url: '/admin/users',
          active: true
        },
        {
          icon: FiBriefcase,
          name: 'Projects',
          url: '/admin/projects',
          active: true
        },
        {
          icon: FiUsers,
          name: 'Teams',
          url: '/admin/teams',
          active: true
        },
        {
          icon: FiList,
          name: 'Types',
          url: '/admin/types',
          active: true
        }
      ]
    }
  ]
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate()
  const onSideBarSelect = (e: string | null) => {
    // Navigate to selected page with react-router
    if (e !== null) {
      navigate(e)
    }
  }
  
  return (
    <>
    <TopBar brand="⏲️ Watchman"/>

    <Container fluid={true} className='no-gutter'>
      <Row>
        <Col>
          <SideBar data={menuItems} onSelect={onSideBarSelect} />
        </Col>
        <Col md={9}>
          <div className='content text-light'>
            {children}
          </div>
        </Col>
      </Row>
    </Container>
    </>
  )
}