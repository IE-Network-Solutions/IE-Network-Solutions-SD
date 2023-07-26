let nodemailer = require('nodemailer');

exports.sendEmailNotification = async (from, to, subject, body) => {
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: body
    };

    var transporter = nodemailer.createTransport({
        host: process.env.HOST_URL,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT === 465 ? true : false, 
        tls: {
            secure: false,
            ignoreTLS: true,
            rejectUnauthorized: false
        },
        auth: {
            user: process.env.SYSTEM_EMAIL,
            pass: process.env.SYSTEM_EMAIL_PASSWORD  
        }
    });      
      
    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email sent: ' + info.response);
            return true;
        }
    }); 
}
