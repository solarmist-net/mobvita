
import * as Sentry from '@sentry/browser'

const userMiddleware = store => next => (action) => {
  const { user } = store.getState()
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'SAVE_SELF_SUCCESS':
    case 'CONFIRM_USER_SUCCESS':
      Sentry.configureScope((scope) => {
        if (user.data) {
          scope.setUser({ email: user.data.user.email })
        }
      })
      break
    default:
      break
  }
  next(action)
}

export default userMiddleware
