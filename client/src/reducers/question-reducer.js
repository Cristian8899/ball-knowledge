const INITIAL_STATE = {
  question: {},
  error: null,
  fetching: false,
  fetched: false
}

const questionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_QUIZ_QUESTION_PENDING':
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null
      }
    case 'GET_QUIZ_QUESTION_FULFILLED':
      return {
        ...state,
        question: action.payload.data.question,
        error: null,
        fetching: false,
        fetched: true
      }
    case 'GET_QUIZ_QUESTION_REJECTED':
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

export default questionReducer
