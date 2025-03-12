/**
 * @module stateActions
 * @description actions for state reset under various circumstances
 * @category actions
 */

export const RESET = 'RESET'
export const RESET_TOKEN_STATE = 'RESET_TOKEN_STATE'

/**
 * @description Trigger state reset in reducers
 * @action resetState
 * @dispatches RESET
 */
export function resetState () {
// export function resetState(questionId, answerId){
  return {
    type: RESET,
    payload: {}
  }
}

export function resetTokenState () {
  // export function resetState(questionId, answerId){
  return {
    type: RESET_TOKEN_STATE,
    payload: {}
  }
}
