var express = require('express');
var cors = require('cors');
var User = require('../models/UserModel');
var Category = require('../models/CategoryModel');
var Response = require('../utils/response');
var api = express.Router();
var config = require('../../config/index');
var defaultConfig = require('../../config/default');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var uuidv4 = require('uuid/v4');

api.all('/*', function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,Cache-Control');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

api.options('/auth', cors())
api.post('/auth', cors(), function (req, res) {
  var e = req.body.email.toLowerCase();
  var pwd = crypto.createHash('md5').update(req.body.password).digest("hex");
  User.findOne({ email: e }, function (err, user) {
    if (err)
      throw err;

    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found'
      })
    } else if (user) {
      if (user.password !== pwd) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password'
        })
      } else {
        log.info(user.email);
        if (user.status === 'user-approval-pending' || user.status === 'admin-approval-pending') {
          res.json({
            success: false,
            message: 'your account is on approval pending'
          })
        } else if (user.status === 'inactive') {
          res.json({
            success: false,
            message: 'your account is inactive'
          })
        } else {
          var token = jwt.sign({ userId: user._id, role: user.role, categoryId: user.categoryId, name: user.firstName + ' ' + user.lastName }, req.app.get('superSecret'), {
            expiresIn: 60 * 60
          });
          res.json({
            success: true,
            message: 'token!',
            token: token,
            user: user
          })
        }
      }
    }
  })
})

api.options('/emailVerify', cors())
api.post('/emailVerify', cors(), function (req, res) {
  User.find({ email: req.body.email }, { __v: 0 }, function (err, records) {
    var token = uuidv4();
    if (!err) {
      var updated = {
        token: token
      }
      console.log("************************sdj");
      if (records && records.length > 0) {
        User.findOneAndUpdate({ "_id": records[0]._id }, { $set: Object.assign({}, updated) }, { upset: true }, function (err, doc) {
          var url = defaultConfig.URL + '/reset-password/new?token=' + token;
          console.log('url---' + url);
          console.log('user--' + JSON.stringify(records));

          // using SendGrid's v3 Node.js Library
          // https://github.com/sendgrid/sendgrid-nodejs
          const sgMail = require('@sendgrid/mail');
          console.log("mail"+sgMail);
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = {
            to: records[0].email,
            from: 'Heineken <' + config.sendGrid.auth.mailId + '>',
            subject: 'Reset-password link',
            text: 'Click below to reset your password .<br><br> ' + url,
            html: 'Click below to reset your password .<br><br> <a href=' + url + '>click here</a>'
          };
          sgMail.send(msg);
          res.send({ status: "true" });
        });
      } else {
        res.json(500, {
          status: "false",
          message: "User doesn't exist"
        });
      }
    } else {
      log.error(err);
    }
  });
});

api.options('/reset-password/', cors())
api.put('/reset-password/', cors(), function (req, res) {
  if (req.query.token) {
    User.find({ token: req.query.token }, { __v: 0 }, function (err, records) {
      if (records && records.length > 0) {
        if (req.body.password) {
          var password = crypto.createHash('md5').update(req.body.password).digest("hex");
        }
        var updated = {
          password: password,
          updated_at: new Date(),
          token: null
        }
        User.findOneAndUpdate({ "_id": records[0]._id }, { $set: Object.assign({}, updated) }, { upset: true }, function (err, doc) {
          if (!err) {
            var resData = Response.data(doc);
            res.send({ status: 'true' });
          } else {
            // Handle Error
            log.error(err);
          }
        });
      } else {
        res.send({
          status: "false",
          message: "invalid token"
        });
      }
    });
  } else {
    res.send({
      status: "false",
      message: "invalid token"
    })
  }
});

api.options('/users-verify', cors())
api.get('/users-verify', cors(), function (req, res) {
  User.find({}, { __v: 0 }, function (err, records) {
    if (!err) {
      if (records && records.length > 0) {
        Category.find({}, { __v: 0 }, function (err, records1) {
          if (!err) {
            res.send(200, { status: "true", category: records1 });
          } else {
            log.error(err);
          }
        });

      } else {
        res.send(200, { status: "false" });
      }
    } else {
      // Handle Error
      log.error(err);
    }
  });
});

api.options('/user', cors())
api.post('/user', cors(), function (req, res) {
  req.body.created_at = new Date();
  var user = new User(req.body);
  user.password = crypto.createHash('md5').update(user.password).digest("hex");
  user.email = user.email.toLowerCase();
  User.find({ email: user.email }, function (err, usr) {
    if (user && usr.length > 0) {
      res.json(500, {
        status: 'false',
        message: 'user already exists'
      });
    } else if (user.password.length < 8) {
      res.send(500, { status: 'password length must be greater than 8' });
    } else {
      if (user.role.indexOf('ADMIN') > -1) {
        user.status = 'active'
        user.roles = 'ADMIN';
      }
      if (user.email.indexOf('in.ibm.com') > -1) {
        user.subRole = "internal";
      } else {
        user.subRole = "external";
      }
      var d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth();
      var day = d.getDate();
      var c = new Date(year + 5, month, day);
      console.log(c);
      user.endDate = c;
      user.token = uuidv4();
      user.save(function (err, user1) {
        if (!err) {
          var resData = Response.data(req.body);
          if (user.role.indexOf('MANAGER') > -1 || user.role.indexOf('LEAD') > -1 || user.role.indexOf('DEVELOPER') > -1 || user.role.indexOf('GUEST') > -1) {
            var url = defaultConfig.URL + '/signup/verifyUser?token=' + user1.token;

            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
              to: user1.email,
              from: 'Biorad <' + config.sendGrid.auth.mailId + '>',
              subject: 'User verification',
              text: 'Click below to verify yourself .<br><br> ' + url,
              html: 'Click below to verify yourself .<br><br> <a href=' + url + '>click here</a>'
            };
            console.log(process.env.SENDGRID_API_KEY);
            
            sgMail.send(msg);
            res.send({ status: 'success' });
          } else {
            res.send({ status: 'success' });
          }

        } else {
          var resError = Response.error({
            code: "500",
            message: "Internal Server Error"
          })
          log.error(err);
          res.status(500).send(err);
        }
      });
    }
  })
});

api.get('/verify-user', function (req, res) {
  if (req.query.token) {
    User.find({ token: req.query.token }, { __v: 0 }, function (err, records) {
      if (!err) {
        if (records && records.length > 0) {
          var a = Date.parse(new Date(records[0].created_at.getTime() + (1 * 24 * 60 * 60 * 1000)));
          var b = new Date().getTime();
          console.log('a---' + a);
          console.log('b----' + b);
          if (b > a) {
            console.log('a---' + a);
            console.log('b----' + b);
            User.deleteOne({ token: req.query.token }, function (err, doc2) {
              console.log('r----' + records[0]._id);
              //console.log('d----'+doc);
              console.log(JSON.stringify('d----' + doc2));
              if (!err) {
                return res.send({ status: false, code: 'FM_ERROR_EXCEED_24' })
              } else {
                log.error(err);
              }
            })
          } else {
            User.find({ __v: 0 }, function (err, aUser) {
              console.log(JSON.stringify(aUser));
              if (aUser && aUser.length > 0) {
                for (var i = 0; i < aUser.length; i++) {
                  var e = null;
                  if (aUser[i].role.indexOf('ADMIN') > -1) {
                    e = aUser[i].email;
                    console.log('email---' + e);
                    var url = defaultConfig.URL + '/users/userReq?userId=' + records[0]._id;
                    console.log('url---' + url);

                    const sgMail = require('@sendgrid/mail');
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = {
                      to: e,
                      from: 'Heineken <' + config.sendGrid.auth.mailId + '>',
                      subject: 'User request',
                      text: 'Click below to approve the user request .<br><br> ' + url,
                      html: 'Click below to approve the user request .<br><br> <a href=' + url + '>click here</a>'
                    };
                    sgMail.send(msg);
                  }
                }
                var updated = {
                  token: null,
                  status: 'admin-approval-pending'
                }
                User.findOneAndUpdate({ "_id": records[0]._id }, { $set: Object.assign({}, updated) }, { upset: true }, function (err, doc) {
                  res.send({ status: true });
                });
              }
            });
          }

        } else {
          res.json({
            status: false,
            code: 'FM_ERROR_INVALID_TOKEN'
          });
        }
      } else {
        // Handle Error
        log.error(err);
      }
    });
  } else {
    res.send({ status: "invalid token" })
  }
});

module.exports = api;