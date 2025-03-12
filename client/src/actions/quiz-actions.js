/**
 * @module quizActions
 * @description actions for quizzes
 * @category actions
 */

import axios from 'axios'
import store from '../stores/store'
import { SERVER } from '../configuration/global'

export const ADD_QUIZ = 'ADD_QUIZ'
export const DELETE_CREATED_QUIZ = 'DELETE_CREATED_QUIZ'
export const GET_PUBLIC_QUIZZES = 'GET_PUBLIC_QUIZZES'
export const GET_PUBLIC_QUIZ = 'GET_PUBLIC_QUIZ'
export const GET_QUIZ_QUESTION = 'GET_QUIZ_QUESTION'
export const GET_RANDOM_QUIZ = 'GET_RANDOM_QUIZ'
export const GET_CREATED_QUIZZES = 'GET_CREATED_QUIZZES'
export const GET_CREATED_QUIZ = 'GET_CREATED_QUIZ'
export const UPDATE_QUIZ = 'UPDATE_QUIZ'

export function getPublicQuizzes (page, pageSize, filterString = '') {
  // const token = store.getState().loginUser.user.token
  return {
    type: GET_PUBLIC_QUIZZES,
    payload: axios.get(`${SERVER}/player-api/quizzes?page=${page}&pageSize=${pageSize}&${filterString}`, {
      headers: {
        // Authorization: token
      }
    })
  }
}

export function getCreatedQuizzes (userId, page, pageSize, filterString = '') {
  const token = store.getState().loginUser.user.token

  return {
    type: GET_CREATED_QUIZZES,
    payload: axios.get(`${SERVER}/owner-api/users/${userId}/quizzes?page=${page}&pageSize=${pageSize}&${filterString}`, {
      headers: {
        Authorization: token
      }
    })
  }
}

export function addQuiz (quizData, userId, page = '', pageSize = '', filterString = '') {
  const token = store.getState().loginUser.user.token

  return {
    type: ADD_QUIZ,
    payload: async () => {
      await axios.post(`${SERVER}/owner-api/quizzes`, quizData, {
        headers: { Authorization: token }
      })

      // Fetch updated list of created quizzes after adding a new quiz
      const response = axios.get(
        `${SERVER}/owner-api/users/${userId}/quizzes?page=${page ?? 0}&pageSize=${pageSize}&${filterString}`,
        { headers: { Authorization: token } }
      )

      return response
    }
  }
}

export function updateQuiz (quizId, updatedQuizData, userId, page = '', pageSize = '', filterString = '') {
  const token = store.getState().loginUser.user.token

  return {
    type: UPDATE_QUIZ,
    payload: async () => {
      await axios.put(`${SERVER}/owner-api/quizzes/${quizId}`, updatedQuizData, {
        headers: { Authorization: token }
      })

      // Fetch updated list of created quizzes after updating a quiz
      const response = axios.get(
        `${SERVER}/owner-api/users/${userId}/quizzes?page=${page ?? 0}&pageSize=${pageSize}&${filterString}`,
        { headers: { Authorization: token } }
      )

      return response
    }
  }
}

export function deleteCreatedQuiz (userId, quizId, page = '', pageSize = '', filterString = '') {
  const token = store.getState().loginUser.user.token

  return {
    type: DELETE_CREATED_QUIZ,
    payload: async () => {
      await axios.delete(`${SERVER}/owner-api/users/${userId}/quizzes/${quizId}`, {
        headers: { Authorization: token }
      })

      // Fetch updated list of created quizzes after deleting a quiz
      const response = axios.get(
        `${SERVER}/owner-api/users/${userId}/quizzes?page=${page ?? 0}&pageSize=${pageSize}&${filterString}`,
        { headers: { Authorization: token } }
      )

      return response
    }
  }
}

export function getPublicQuiz (quizId) {
  // const token = store.getState().loginUser.user.token
  return {
    type: GET_PUBLIC_QUIZ,
    payload: axios.get(`${SERVER}/player-api/quizzes/${quizId}`, {
      headers: {
        // Authorization: token
      }
    })
  }
}

export function getCreatedQuiz (userId, quizId) {
  const token = store.getState().loginUser.user.token
  return {
    type: GET_CREATED_QUIZ,
    payload: axios.get(`${SERVER}/owner-api/users/${userId}/quizzes/${quizId}`, {
      headers: {
        Authorization: token
      }
    })
  }
}

export function getQuizQuestion (quizId, questionId) {
  // const token = store.getState().loginUser.user.token
  return {
    type: GET_QUIZ_QUESTION,
    payload: axios.get(`${SERVER}/player-api/quizzes/${quizId}/questions/${questionId}`, {
      headers: {
        // Authorization: token
      }
    })
  }
}

export function getRandomQuiz () {
  return {
    type: GET_RANDOM_QUIZ,
    payload: axios.get(`${SERVER}/player-api/random-quiz`, {
      headers: {
        // Authorization: token
      }
    })
  }
}
