import { io } from 'socket.io-client'
import { SERVER } from './configuration/global'

const socket = io(SERVER, {
  autoConnect: false,
  transports: ['websocket']
})

export default socket
