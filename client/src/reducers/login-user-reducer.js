const INITIAL_STATE = {
  user: null,
  isAuthenticated: false,
  error: null,
  fetching: false,
  fetched: false
}

const loginReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOGIN_PENDING':
    case 'CREATE_GUEST_USER_PENDING':
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null
      }
    case 'LOGIN_FULFILLED':
    case 'CREATE_GUEST_USER_FULFILLED':
      return {
        ...state,
        user: action.payload?.data?.data,
        isAuthenticated: true,
        error: null,
        fetching: false,
        fetched: true
      }
    case 'LOGIN_REJECTED':
    case 'CREATE_GUEST_USER_REJECTED':
      return {
        ...state,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        fetching: false,
        fetched: false
      }
    case 'RESET_TOKEN_STATE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        fetching: false,
        fetched: true,
        error: null
      }
    case 'RESET_LOGIN':
    case 'RESET':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
        fetching: false,
        fetched: true
      }
    default:
      return state
  }
}

export default loginReducer
