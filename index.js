const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())

const PORT = 8080
const server = app.listen(PORT, () => {
	console.log(`serving on port ${PORT}`)
})

const io = socketio(server, {
	handlePreflightRequest: (req, res) => {
		const headers = {
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Access-Control-Allow-Origin': req.headers.origin, //or the specific origin you want to give access to,
			'Access-Control-Allow-Credentials': true
		}
		res.writeHead(200, headers)
		res.end()
	}
})

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
