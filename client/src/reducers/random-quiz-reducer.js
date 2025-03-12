const INITIAL_STATE = {
  randomQuizId: null,
  error: null,
  fetching: false,
  fetched: false
}

const randomQuizReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_RANDOM_QUIZ_PENDING': {
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null
      }
    }
    case 'GET_RANDOM_QUIZ_FULFILLED': {
      return {
        ...state,
        randomQuizId: action.payload.data.randomQuizId,
        error: null,
        fetching: false,
        fetched: true
      }
    }
    case 'GET_RANDOM_QUIZ_REJECTED': {
      return {
        ...state,
        error: action.payload.response.data,
        fetching: false,
        fetched: false
      }
    }
    case 'RESET': {
      return INITIAL_STATE
    }
    default: {
      return state
    }
  }
}

export default randomQuizReducer
