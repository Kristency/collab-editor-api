const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())

const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
	console.log(`serving on port ${PORT}`)
})

const io = socketio.listen(server)

io.on('connection', (socket) => {
	let editorId = null

	console.log(`new socket connection with id ${socket.id}`)
	socket.on('send-text', (data) => {
		io.in(editorId).emit('receive-text', data)
	})

	socket.on('join-editor', (id) => {
		socket.join(id, () => {
			editorId = id
			console.log(`Joined editor with id ${id} successfully`)
		})
	})
})
