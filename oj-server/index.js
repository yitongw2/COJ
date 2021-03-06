const express = require('express');
const app = express();
const path = require('path');
const http = require('http');

// socket.io
const socketIO = require('socket.io');
const io = socketIO();
const editorSocketService = require('./services/editorSocketService')(io);

const mongoose = require('mongoose');
const db_config = require('./config/mongodb-config.json');
mongoose.connect(`mongodb://${db_config.DBUser}:${db_config.DBPassword}@${db_config.DBHost}:${db_config.DBPort}/${db_config.DBName}`,
  err => {
    if (err) {
      console.log('DB connection failed');
    } else {
      console.log('DB connection succeeded');
    }
  });

// routers
const restRouter = require('./routes/rest');
const searchRouter = require('./routes/search');
const executorRouter = require('./routes/executor');

// cors
const cors = require('cors');

app.use(cors());
app.use('/api/v1/execution', executorRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1', restRouter);
app.use(express.static(path.join(__dirname, '../public/')));
app.use((req, res) => {
  res.sendFile('index.html', {root: path.join(__dirname, '../public/')});
});

const server = http.createServer(app);
io.attach(server);
server.listen(3000);
server.on('listening', onListening); // listening call back

function onListening() {
  console.log('App listening on port 3000!')
}
