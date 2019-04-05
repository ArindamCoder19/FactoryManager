var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var config = require('config');
var mongoose = require('mongoose');
var dbConfig = require('./config/default');
var bunyan = require('bunyan');
var cors = require('cors');
// var emailService = require(__dirname + '/' + 'app/controllers/emailController');
var configindex = require(__dirname + '/' + 'config/index');
var CronJob = require('cron').CronJob;
var User = require(__dirname + '/' + 'app/models/UserModel');
global.log = bunyan.createLogger({ name: "api-demo" });
var jwt = require('jsonwebtoken');
var Notifications = require(__dirname + '/' + 'app/models/NotificationModel');
// var socketEvents = require(__dirname + '/' + '/socketEvents');
var socket = require('socket.io');
// var Notificationsocket = require(__dirname + '/' + 'app/controllers/NotificationController');

//DB Connection
mongoose.connect(dbConfig.db).then(() => {
  console.log('DB connected');
});
mongoose.set('debug', true);

//DB authentication
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

var router = express.Router();

router.get('/', function (req, res) {
  res.json({ 'message': 'hurreh! Welcome to API!' })
})

app.use('/api', require('./app/controllers/AuthController'));

app.use(function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        return res.json({
          success: false, message: 'Failed to authenticate token.'
        })
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } else {
    return res.status(403).send({
      success: false,
      message: 'token please'
    })
  }
});

app.use(cors());


app.use('/api', require('./app/controllers/UserController'));
app.use('/api', require('./app/controllers/TaskController'));
app.use('/api', require('./app/controllers/CategoryController'));
app.use('/api', require('./app/controllers/SubCategoryController'));
// app.use('/api', require('./app/controllers/StatusController'));
app.use('/api', require('./app/controllers/ProjectController'));
app.use('/api', require('./app/controllers/DashboardController'));
app.use('/api', require('./app/controllers/FunctionalConsultantController'));
app.use('/api', require('./app/controllers/CommentController'));
app.use('/api', require('./app/controllers/TimesheetController'));
app.use('/api', require('./app/controllers/UserDashboardController'));
app.use('/api', require('./app/controllers/ManagedByController'));
app.use('/api', require('./app/controllers/StatusFSController'));
app.use('/api', require('./app/controllers/ProjectTypeController'));
app.use('/api', require('./app/controllers/FutureScopeController'));
app.use('/api', require('./app/controllers/Demand&CapacityController'));
app.use('/api', require('./app/controllers/ProductivityReportController'));
app.use('/api', require('./app/controllers/NotificationController'));

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('listening for requests on port 3000');
});

server.on('error', function (err) {
  console.error(err)
})

const io = require('socket.io').listen(server);
let clientObj = {};

io.on('connection', (socket) => {

  let userId = socket.handshake.query.userID;

  if (clientObj[userId] && io.sockets.connected[clientObj[userId]]) {
    io.sockets.connected[clientObj[userId]].disconnect();
  }

  clientObj[userId] = socket.id;
  console.log("Connected list now-->", clientObj);

  socket.on('NotificationSent', (params) => {
    let i;
    let { userIdList, notifId } = params,
      userLen = userIdList.length;
    let connectedUserIds = [];

    for (i = 0; i < userLen; i++) {
      if (clientObj[userIdList[i]]) {
        connectedUserIds.push(mongoose.Types.ObjectId(userIdList[i]));
      }
    }
    console.log("List of connected receipients(on NotificationSent) now-->", connectedUserIds);

    Notifications.find({ uniqueId: notifId, status: "new", user: { $in: connectedUserIds } }).populate('user', 'firstName lastName')
      .populate('author', 'firstName lastName').then(function (data) {
        data.forEach((item) => {
          io.to(clientObj[item.user[0]._id]).emit('newNotif', item);
        })
      })
  });

  socket.on('NotificationArc', (params) => {
    let { authorId, userId, uniqueId } = params;
    console.log("Archived Notification Params*******************", params);

    if (clientObj[authorId]) {
      io.to(clientObj[authorId]).emit('archivedACK', { uniqueId: uniqueId, userId: userId });
    }
  });

  socket.on('NotifyAgain', (params) => {
    let { userIdList, uniqueId } = params,
      userLen = userIdList.length;
    console.log("Notify Again Params*******************", params);

    for (i = 0; i < userLen; i++) {
      if (clientObj[userIdList[i]]) {
        io.to(clientObj[userIdList[i]]).emit('notifyAgainACK', uniqueId);
      }
    }

  });

  socket.on('disconnect', () => {
    socket.disconnect();
    delete clientObj[userId];

    console.log("Disconnected user-->", userId);
    console.log("Connected list now-->", clientObj);
  });
});

new CronJob('00 00 06 * * 1-7', function () {
  console.log('Hello I am Cron!')
  User.find().exec(function (err, records) {
    var arrusers = [];
    var users = {};
    var arremail = [];
    if (records && records.length > 0) {
      for (var i = 0; i < records.length; i++) {
        // console.log(records[i].endDate);
        var a = records[i].endDate.setHours(0, 0, 0, 0);
        var b = new Date().setHours(0, 0, 0, 0)
        // console.log(a);
        // console.log(b);

        if (records[i].role.indexOf('ADMIN') > -1) {
          var e = records[i].email.split(',');
          arremail.push(e);
        }

        if (b > a && records[i].status == 'active') {
          users = records[i].firstName + " " + records[i].lastName;
          arrusers.push(users);

          User.findOneAndUpdate({ "_id": records[i]._id }, { $set: Object.assign({}, { status: 'inactive' }) }, { upset: true }, function (err, doc) {
            console.log('status changed');
          });
        }
      }
      // console.log('user====='+arrusers.length);
      // console.log('email---'+arremail);
      if (arrusers.length > 0) {

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: records[0].email,
          from: 'Heineken <' + config.sendGrid.auth.mailId + '>',
          subject: 'User Deactivated List',
          text: 'Here are the user details.<br><br>',
          html: 'Lists<br> <br> <ul> <li>' + arrusers + '</li> </ul>'
        };
        sgMail.send(msg);
      }
    }
  })
}, null, true, 'Asia/Kolkata');
