let nodemailer = require('nodemailer');
const configs = require("./configs");

exports.sendEmailNotification = async (from, to, subject, body, cc) => {
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: body,
        cc
    };

    var transporter = nodemailer.createTransport({
        host: configs.email.hostURL,
        port: configs.email.emailPort,
        secure: configs.email.emailPort === 465 ? true : false,
        tls: {
            secure: false,
            ignoreTLS: true,
            rejectUnauthorized: false
        },
        service: "gmail",
        auth: {
            user: configs.email.systemEmail,
            pass: configs.email.emailPassword,
        }
    });

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email notiicatio is sent to admin: ' + info.response);
            return true;
        }
    });
}