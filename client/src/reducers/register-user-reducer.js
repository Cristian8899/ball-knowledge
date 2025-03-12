const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  error: null
}

const registerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'REGISTER_PENDING':
      return { ...state, fetching: true, fetched: false, error: null }

    case 'REGISTER_FULFILLED':
      return { ...state, fetching: false, fetched: true, error: null }

    case 'REGISTER_REJECTED':
      return { ...state, fetching: false, fetched: false, error: action.payload }

    case 'RESET':
      return INITIAL_STATE

    default:
      return state
  }
}

export default registerReducer
