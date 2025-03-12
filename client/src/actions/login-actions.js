/**
 * @module loginActions
 * @description actions for login
 * @category actions
 */
import { Buffer } from 'buffer'
import { SERVER } from '../configuration/global'
import axios from 'axios'
import store from '../stores/store'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const REGISTER = 'REGISTER'
export const CREATE_GUEST_USER = 'CREATE_GUEST_USER'

export function login (username, password) {
  return {
    type: LOGIN,
    payload: axios.post(
      `${SERVER}/auth-api/user`,
      {},
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            username + ':' + password
          ).toString('base64')}`
        }
      }
    )
  }
}

export function register (username, password, fullName, email) {
  return {
    type: REGISTER,
    payload: axios.post(`${SERVER}/auth-api/register`, {
      username,
      password,
      fullName,
      email
    })
  }
}

export function createGuestUser (username, fullName) {
  return {
    type: CREATE_GUEST_USER,
    payload: axios.post(`${SERVER}/auth-api/guest-users`, {
      username,
      fullName
    })
  }
}

export function logout () {
  const { token } = store.getState().loginUser.user
  return {
    type: LOGOUT,
    payload: axios.delete(`${SERVER}/auth-api`, { headers: { Authorization: token } })
  }
}
