import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { confirmUser } from 'Utilities/redux/userReducer'
import { useHistory } from 'react-router'

const EmailConfirm = ({ match }) => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user.data)
  const history = useHistory()

  useEffect(() => {
    if (user) {
      history.replace('/home')
    }
  }, [user])

  return <button type="button" className="btn btn-primary" onClick={() => dispatch(confirmUser(match.params.token))}>Confirm Email</button>
}

export default EmailConfirm
