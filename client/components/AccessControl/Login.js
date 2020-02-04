import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createRealToken, createAnonToken } from 'Utilities/redux/userReducer'
import { Segment, Header, Form } from 'semantic-ui-react'
import { useHistory, useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import Button from 'react-bootstrap/Button'


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginError = useSelector(({ user }) => user.error)
  const errorMessage = useSelector(({ user }) => user.errorMessage)
  const user = useSelector(({ user }) => user.data)
  const location = useLocation()
  const history = useHistory()
  const intl = useIntl()

  const dispatch = useDispatch()

  const login = () => dispatch(createRealToken(email, password))
  const loginAnon = () => dispatch(createAnonToken())

  useEffect(() => {
    const { from } = location.state || { from: { pathname: '/' } }

    if (user) {
      if (!user.user.last_used_language) {
        history.replace('/learningLanguage')
      } else {
        history.replace(from)
      }
    }
  }, [user])
  return (
    <>
      <h1>{intl.formatMessage({ id: 'Login' })} </h1>
      <Segment>
        <p>
          <FormattedMessage id="master-a-language-by-learning-from-stories-of-your-own-choosing" />
        </p>
        <Form onSubmit={login}>
          <Form.Field>
            <Form.Input
              label={intl.formatMessage({ id: 'email-address' })}
              error={loginError}
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder={intl.formatMessage({ id: 'email-address' })}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label={intl.formatMessage({ id: 'Password' })}
              error={loginError}
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder=""
            />
          </Form.Field>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              variant="primary"
              data-cy="login"
              type="submit"
            >
              {intl.formatMessage({ id: 'Login' })}
            </Button>
            {loginError && <div style={{ color: 'red' }}>{errorMessage}</div>}
          </div>
        </Form>
        <h5>
          {intl.formatMessage({ id: 'dont-have-an-account-yet-please-ce3fb38f81375d77a43cbaa071a4f72f' })}
        </h5>
        <div>
          <Link to="/register"><Button variant="secondary">{intl.formatMessage({ id: 'Register' })} </Button></Link>
          <Button data-cy="login-anon" variant="secondary" onClick={loginAnon}>
            <FormattedMessage id="try-mobvita" />
          </Button>
        </div>
      </Segment>
    </>
  )
}

export default Login
