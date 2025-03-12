import { io } from 'socket.io-client'

const socket = io(process.env.REACT_APP_BALLKNOWLEDGE_SERVER_DEV, {
  autoConnect: false,
  transports: ['websocket']
})

export default socket
