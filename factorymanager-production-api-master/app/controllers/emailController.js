var nodemailer = require('nodemailer'),
    fs = require('fs'),
    Email = require('../models/email'),
    config = require('../../config/index'),
    transporter = nodemailer.createTransport(config.smtp.gmail);

exports.sendEmail = function (smtp, mailOptions) {
    var mail = new Email(mailOptions);
    mail.status = 'NEW';
    //save the email
    mail.save(function (err, savedMail) {
        //add a tracking pixel to email

        var trkCode = '<img alt="" src="' + getTrackingCode(savedMail.id, 'open') + '" width="1" height="1" border="0" />';
        mailOptions.html = trkCode + mailOptions.html;
        console.log('---text==' + mailOptions.html);

        if (smtp) {
            transporter = nodemailer.createTransport(smtp);
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('error' + JSON.stringify(error));
                var body = {
                    status: 'FAILED'
                }
                Email.findOneAndUpdate({ "_id": savedMail.id }, { $set: Object.assign({}, body) }, { upset: true }, function (err, doc) {
                    if (!err) {
                        return console.log(doc);
                    } else {
                        return console.log(err);
                    }
                });
            } else {
                console.log('info' + JSON.stringify(info));
                var body = {
                    status: 'SUCCESS'
                }
                Email.findOneAndUpdate({ "_id": savedMail.id }, { $set: Object.assign({}, body) }, { upset: true }, function (err, doc) {
                    if (!err) {
                        return console.log(doc);
                    } else {
                        return console.log(err);
                    }
                });
            }
        });
    });
};

var getTrackingCode = function (id, action) {
    return config.url.url + '/trk/em/' + id + '/open';
    //var trkCode = '<img alt="" src="'+ config.environment.url+ '/trk/em?id=' +id +'?action=open" width="1" height="1" border="0" />';
};
