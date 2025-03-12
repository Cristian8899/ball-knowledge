const INITIAL_STATE = {
  createdQuizzes: [],
  count: 0,
  error: null,
  fetching: false,
  fetched: false
}

const createdQuizzesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_CREATED_QUIZZES_PENDING':
    case 'ADD_QUIZ_PENDING':
    case 'DELETE_CREATED_QUIZ_PENDING':
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null
      }
    case 'GET_CREATED_QUIZZES_FULFILLED':
    case 'ADD_QUIZ_FULFILLED':
    case 'DELETE_CREATED_QUIZ_FULFILLED':
      return {
        ...state,
        createdQuizzes: action.payload.data.quizzes,
        count: action.payload.data.count,
        error: null,
        fetching: false,
        fetched: true
      }
    case 'GET_CREATED_QUIZZES_REJECTED':
    case 'ADD_QUIZ_REJECTED':
    case 'DELETE_CREATED_QUIZ_REJECTED':
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

export default createdQuizzesReducer
