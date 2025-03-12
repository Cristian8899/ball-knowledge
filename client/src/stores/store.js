import { applyMiddleware, createStore } from 'redux'
import promise from 'redux-promise-middleware'
import throttle from 'lodash/throttle'
import { loadState, saveState } from './local-storage'
import reducer from '../reducers'

const middleware = applyMiddleware(promise)

const persistedState = loadState()

const store = createStore(reducer, persistedState, middleware)

store.subscribe(
  throttle(() => {
    saveState(store.getState())
  }, 1000)
)

export default store
