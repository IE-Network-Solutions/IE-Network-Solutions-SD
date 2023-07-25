let nodemailer = require('nodemailer');

const sendEmail = async (from, to, subject, body) => {
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
      
    console.log("sending");
    await transporter.sendMail(mailOptions, function(error, info){
        console.log("process");
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