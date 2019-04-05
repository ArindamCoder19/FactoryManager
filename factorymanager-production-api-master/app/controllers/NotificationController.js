var express = require('express'),
  api = express(),
  User = require("../models/UserModel"),
  uniqid = require('uniqid'),
  Notifications = require("../models/NotificationModel"),
  NotificationIdentifier = require("../models/NotificationIdentifierModel");
var config = require('../../config/index');

const sendMail = (userId, authorId, isNew) => {
  User.find({ _id: { '$in': [userId, authorId] } }, { firstName: 1, lastName: 1, email: 1 }).exec(function (err, user_data) {
    var userDetails, authorDetails;

    if (user_data[0]._id.toString() == userId.toString()) {
      userDetails = user_data[0];
      authorDetails = user_data[1];
    } else {
      userDetails = user_data[1];
      authorDetails = user_data[0];
    }

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    let userName = userDetails.firstName + ' ' + userDetails.lastName;
    let authorName = authorDetails.firstName + ' ' + authorDetails.lastName;

    let msg = {
      to: userDetails.email,
      from: 'Heineken <' + config.sendGrid.auth.mailId + '>',
      subject: '',
      text: '',
      html: ''
    };

    if (isNew) {
      msg['subject'] = authorName + ' has sent you a notification.';
      msg['text'] = 'Hi ' + userName + ',<br><br> A notification was sent to you by ' + authorName + '.<br> Please login to Factory Manager for details.';
      msg['html'] = 'Hi ' + userName + ',<br><br> A notification was sent to you by ' + authorName + '.<br> Please login to Factory Manager for details.';
    } else {
      msg['subject'] = authorName + ' has renotified you for a pending notification.';
      msg['text'] = 'Hi ' + userName + ',<br><br> A re-notification was sent to you by ' + authorName + '.<br> Please login to Factory Manager for details.';
      msg['html'] = 'Hi ' + userName + ',<br><br> A re-notification was sent to you by ' + authorName + '.<br> Please login to Factory Manager for details.';
    }

    console.log(JSON.stringify(msg));

    sgMail.send(msg);
  })
}

api.post('/notification', async function (req, res) {

  let token = req.decoded;
  req.body.created_at = new Date();

  var reqObj = {};
  var user = req.body.user;
  var developerCategory = req.body.category;
  var userLength = user.length;
  var genericUserList = [];
  let uniqueId = uniqid();
  for (var i = 0; i < userLength; i++) {

    if (user[i] === 'DEVELOPER' || user[i] === 'LEAD' || user[i] === 'MANAGER') {

      var filter = { 'role': user[i], status: 'active' };
      if(user[i] === 'DEVELOPER' && developerCategory.length > 0) {
        filter['categoryId'] = {'$in': developerCategory}
      }

      User.find(filter).exec(function (err, user_data) {

        var a = user_data;
        for (var j = 0; j < a.length; j++) {
          console.log(a[j]);
          reqObj = {
            user: a[j].id,
            dueDate: req.body.dueDate,
            message: req.body.message,
            status: req.body.status,
            uniqueId: uniqueId,
            created_at: new Date()
          }

          let isNewMail = true;
          sendMail(a[j]._id, token.userId, isNewMail);

          var notification = new Notifications(reqObj);
          notification.author = token.userId;
          notification.save();
        }

      })
    } else {

      reqObj = {
        user: user[i],
        dueDate: req.body.dueDate,
        message: req.body.message,
        status: req.body.status,
        uniqueId: uniqueId,
        created_at: new Date()
      }

      genericUserList.push(user[i]);
      let isNewMail = true;
      sendMail(user[i], token.userId, isNewMail);

      var notification = new Notifications(reqObj);
      notification.author = token.userId;
      notification.save();
    }

  }

  if (uniqueId) {
    let notificationIdentifier = new NotificationIdentifier(req.body);
    notificationIdentifier.author = token.userId;
    notificationIdentifier.uniqueId = uniqueId;
    notificationIdentifier.save();
  }

  res.send({ status: 'success', notifId: uniqueId, userIdList: genericUserList })

});




api.put('/notification/:id', function (req, res) {
  Notifications.findOneAndUpdate({ '_id': req.params.id }, { $set: Object.assign({}, req.body) }, { upset: true }, function (notification_err, notification_data) {
    if (!notification_err) {
      res.send({ 'status': true });
    } else {
      log.error(err);
    }
  })
})

let getNotifications = (res, filter) => {
  console.log(filter);
  Notifications.find(filter).sort({ 'created_at': -1 }).populate('user', 'firstName lastName')
    .populate('author', 'firstName lastName').then(function (data, err) {
      // console.log(data);
      res.send(data)
    })
}

api.get('/notifications', function (req, res) {

  let token = req.decoded;
  let filter = {};
  console.log(token.userId);
  filter.user = token.userId;

  if (req.query.status) {
    filter.status = req.query.status;
  }

  getNotifications(res, filter);
})

let getSentNotifications = (res, filter) => {

  NotificationIdentifier.find(filter).exec(async function (notificationid_err, notificationid_data) {
    let arr = [];

    for (let i in notificationid_data) {
      let uid = notificationid_data[i].uniqueId;
      await Notifications.aggregate(
        [{ '$match': { uniqueId: uid } },
        {
          '$group': {
            _id: '$uniqueId',
            message: { '$min': '$message' },
            dueDate: { '$min': '$dueDate' },
            created_at: { '$min': '$created_at' },
            users: {
              '$push': {
                user: { '$arrayElemAt': ['$user', 0] },
                status: '$status'
              }
            },
            archivedCount: { '$sum': { $cond: { if: { $eq: ["$status", "archived"] }, then: 1, else: 0 } } }
          }
        }
        ]).then(async function (notification_data, notification_err) {

          await User.populate(notification_data, { path: "users.user", select: 'firstName lastName' }, function (user_err, user_data) {
            arr.push(notification_data[0]);

          });
        });
    }
    res.send(arr);

  });
}

api.get('/sent-notifications', function (req, res) {
  let token = req.decoded;
  let filter = {};
  filter.author = token.userId;

  getSentNotifications(res, filter);
})

let getRenotified = (res, filter) => {

  Notifications.find(filter).exec(async function (notification_err, notification_data) {

    for (let i in notification_data) {
      await Notifications.findOneAndUpdate({ '_id': notification_data[i].id }, { $set: Object.assign({}, { status: 'renotified' }) }, { upset: true }, function (update_err, update_data) {
        let isNewMail = false;
        sendMail(update_data.user[0], update_data.author[0], isNewMail);

      });
    }
    res.send(true);
  })

}
api.put('/notifyAgain', function (req, res) {
  let filter = {};
  filter.uniqueId = req.query.uniqueId;
  filter.status = 'new'

  getRenotified(res, filter);
})

module.exports = api;
