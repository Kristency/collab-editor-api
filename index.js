const express = require('express')
const socketio = require('socket.io')

const app = express()
const PORT = 8080
const server = app.listen(PORT, () => {
	console.log(`serving on port ${PORT}`)
})

const io = socketio(server)

io.on('connection', (socket) => {
	let editorId = null

	console.log(`new socket connection with id ${socket.id}`)
	socket.on('text', (data) => {
		// console.log(data)
		io.in(editorId).emit('text', data)
	})

	socket.on('create-editor', (id) => {
		socket.join(id, () => {
			editorId = id
			console.log(`Joined editor with id ${id} successfully`)
		})
	})
})
