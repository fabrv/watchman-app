import { Container } from 'react-bootstrap'
import LoginButton from '../components/LoginButton'
import LogoutButton from '../components/LogOutButton'
// import { TopBar } from '../components/TopBar'

export const LandingPage = () => {
  return (
    <>
      {/* <TopBar
        brand='⏲️ Watchman'
        showNav={false}
      /> */}
      <Container fluid={true} className='no-gutter content text-light'>
        <h1>Welcome to Watchman</h1>
        <p>To do: Landing Page with features and pricing info</p>

        <LoginButton />
        <LogoutButton/>
      </Container>
    </>
  )
}
