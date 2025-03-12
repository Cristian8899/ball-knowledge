const INITIAL_STATE = {
  publicQuizzes: [],
  count: 0,
  error: null,
  fetching: false,
  fetched: false
}

const publicQuizzesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_PUBLIC_QUIZZES_PENDING':
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null
      }
    case 'GET_PUBLIC_QUIZZES_FULFILLED':
      return {
        ...state,
        publicQuizzes: action.payload.data.quizzes,
        count: action.payload.data.count,
        error: null,
        fetching: false,
        fetched: true
      }
    case 'GET_PUBLIC_QUIZZES_REJECTED':
      return {
        ...state,
        error: action.payload.response.data,
        fetching: false,
        fetched: false
      }

    case 'RESET':
      return INITIAL_STATE
    default:
      break
  }
  return state
}

export default publicQuizzesReducer
