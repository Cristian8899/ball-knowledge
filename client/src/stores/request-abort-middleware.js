const requestAbortMiddleware = store => next => action => {
  if (action.payload?.message !== 'REQUEST_CANCELLED') {
    return next(action)
  }
}
export default requestAbortMiddleware
