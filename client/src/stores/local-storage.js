/* global localStorage */

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('ball-knowledge-state')
    return serializedState ? JSON.parse(serializedState) : undefined
  } catch (e) {
    console.warn('Error loading state:', e)
    return undefined
  }
}

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      loginUser: {
        ...state.loginUser,
        fetching: false
      },
      quiz: state.quiz
    })
    localStorage.setItem('ball-knowledge-state', serializedState)
  } catch (e) {
    console.warn('Error saving state:', e)
  }
}
