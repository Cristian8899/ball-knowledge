const INITIAL_STATE = {
  quiz: {},
  error: null,
  fetching: false,
  fetched: false
}

const quizReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_PUBLIC_QUIZ_PENDING':
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null
      }
    case 'GET_PUBLIC_QUIZ_FULFILLED':
      return {
        ...state,
        quiz: action.payload.data.quiz,
        error: null,
        fetching: false,
        fetched: true
      }
    case 'GET_PUBLIC_QUIZ_REJECTED':
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

export default quizReducer
