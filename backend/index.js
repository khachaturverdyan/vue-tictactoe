const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const userRouter = require('./routes/userRoutes');
const PORT = process.env.PORT || 8000;

app.use(express.json());

const corsOptions = {
  origin: '*',

}
app.use(cors(corsOptions));

app.use('', userRouter);
dotenv.config({path: './config.env'})
// console.log(process.env)

const DB = process.env.DATABASE.replace(
    '<password>', 
    process.env.DATABASE_PASSWORD
)

mongoose.connect(DB, {
}).then(con => {
    // console.log(con.connections)
    console.log('DB connection successfull')
})

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Connected to the socket from ${socket.id}`)
  socket.on('multiplayer', (data) => {
    console.log(`Received multiplayer action: ${data.user}, ${data.value}.`)
    socket.broadcast.emit('incomingMessage', data);
  })
  socket.on('gameState', (data) => {
    console.log('Received game state:', data);
    socket.broadcast.emit('incomingGameState', data);
  })

  socket.on('closeMultiplayerGame', () => {
    socket.broadcast.emit('closeMultiplayerGame');
  });
});
