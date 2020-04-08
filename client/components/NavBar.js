import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar } from 'react-bootstrap'
import Headroom from 'react-headroom'
import { Icon } from 'semantic-ui-react'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'


export default function NavBar({ history }) {
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const open = useSelector(({ sidebar }) => sidebar.open)
  const dispatch = useDispatch()
  const intl = useIntl()

  const smallWindow = useWindowDimensions().width < 640

  const handleEloClick = () => {
    history.push('/profile/progress')
  }

  const elo = (user && user.user.exercise_history && user.user.exercise_history[user.user.exercise_history.length - 1] && user.user.exercise_history[user.user.exercise_history.length - 1].score)
    ? user.user.exercise_history[user.user.exercise_history.length - 1].score
    : 0

  return (
    <Headroom
      disableInlineStyles={!smallWindow}
      style={!smallWindow && { position: 'fixed', top: 0, width: '100%', zIndex: '100' }}
    >
      <Navbar style={{ paddingLeft: '0.5em' }}>
        <div style={{ display: 'flex' }}>
          <Icon
            name="bars"
            size="big"
            onClick={() => dispatch(sidebarSetOpen(!open))}
            className="sidebar-hamburger"
            style={{ color: 'white' }}
            data-cy="hamburger"
          />
          <Navbar.Brand
            style={{ color: 'white', marginLeft: '0.5em', cursor: 'pointer' }}
            onClick={() => history.push('/home')}
          >

            Revita
          </Navbar.Brand>
        </div>
        {user && (

          <Navbar.Text style={{ color: 'white', marginRight: '1em', cursor: 'pointer' }} onClick={handleEloClick}>
            <div>{`${intl.formatMessage({ id: 'score' })} ${elo}`}</div>
          </Navbar.Text>
        )}
      </Navbar>
    </Headroom>
  )
}
