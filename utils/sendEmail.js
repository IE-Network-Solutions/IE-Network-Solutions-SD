const nodemailer = require('nodemailer');
const configs = require("./configs");


const sendEmail = async (from, to, subject, body, cc) => {
    // You can test with this
    // const testAccount = await nodemailer.createTestAccount();
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //       user: testAccount.user,
    //       pass: testAccount.pass,
    //     },
    //   });
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: body,
        cc: cc,
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
            console.log('Email sent: ' + info.response);
            return true;
        }
    });
}


module.exports = sendEmail;