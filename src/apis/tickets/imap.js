
const Imap = require('imap');
const { inspect } = require('util');
const { getConnection } = require('typeorm');
const User = require('../../models/User');
const Ticket = require('../../models/Ticket');
const JunkTicket = require('../../models/JunkTicket');
const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const { simpleParser } = require('mailparser');
const sendEmail = require('../../../utils/sendEmail');
const AppError = require('../../../utils/apperror');
const config = require('../../../utils/configs');

let lastProcessedSeqNo = 0;

exports.imapFetch = async () => {
  const imap = new Imap({
    user: process.env.senderEmail,
    password: process.env.passwordEmail,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false
    }
  });

  function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
  }

  try {
    imap.once('ready', function() {
      openInbox(
        function(err, box) {
        if (err) throw err;

        const fetchRange = getFetchRange(box);

        var f = imap.seq.fetch(fetchRange, {
          bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', ''],
          struct: true,
        });

        f.on('message',
         async function(msg, seqno) {
          // console.log('Message #%d', seqno);
          var prefix = '(#' + seqno + ') ';
          const messageData = {
            prefix: prefix,
            headers: null,
            body: null,
            attributes: null
          };

          // Extract headers of the message
          msg.on('body', function(stream, info) {
            var buffer = '';
            stream.on('data', function(chunk) {
              buffer += chunk.toString('utf8');
            });
            stream.once('end', function() {
              // console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
              messageData.headers = Imap.parseHeader(buffer);
            });
          });

          // Extract attributes (flags) of the message
          msg.once('attributes', async function(attrs) {
            // console.log(prefix + 'Attributes: %s', await inspect(attrs, false, 12));
            messageData.attributes = attrs;
            if (messageData.attributes.flags && !messageData.attributes.flags.includes('\\Seen')) {
              await saveEmailToDatabase(messageData, imap);
            }
          });

          // Extract the body of the message
          msg.once('body', function(stream, info) {
            var buffer = '';
            stream.on('data', function(chunk) {
              buffer += chunk.toString('utf8');
            });
            stream.once('end',async function() {
              // console.log(prefix + 'Body: %s', buffer);
              // Parse the email using mailparser
      const parsedEmail = await simpleParser(buffer);
              messageData.body = parsedEmail.text ;
              // console.log("---------------------------")
              // console.log( "Body Buffer",parsedEmail.text || '')
              // console.log("---------------------------")

            });
          });
        });

        f.once('error', function(err) {
          console.log('Fetch error: ' + err);
        });

        f.once('end', function() {
          updateLastProcessedSeqNo(box);
          console.log('Done fetching all messages!');
          imap.end();
        });
      });
    });

    imap.once('error', function(err) {
      console.log(err);
      console.log('An Error occurred');
    });

    imap.once('end', function() {
      console.log('Connection ended');
    });

    imap.connect();
  } catch (error) {
    console.log(error);
    console.log('An Error occurred because of the server error');
  }
};

function getFetchRange(box) {
  if (lastProcessedSeqNo === 0) {
    // Fetch only unseen emails if lastProcessedSeqNo is 0
    return '1:' + box.messages.total + ' UNSEEN';
  } else {
    // Fetch only unseen emails since the last processed sequence number
    return (lastProcessedSeqNo + 1) + ':' + box.messages.total + ' UNSEEN';
  }
}

function updateLastProcessedSeqNo(box) {
  if (lastProcessedSeqNo < box.messages.total) {
    lastProcessedSeqNo = box.messages.total;
  }
}

async function saveEmailToDatabase(messageData, imap) {
  try {
    const senderEmail = messageData.headers.from[0];
    
    let Sender;
// Find the position of '<' and '>'
const startIndex = senderEmail.indexOf('<');
const endIndex = senderEmail.indexOf('>');

if (startIndex !== -1 && endIndex !== -1) {
  // Extract the string between '<' and '>'
  const email = senderEmail.substring(startIndex + 1, endIndex);
   Sender =`${ email}`
//   senderEmail = Sender

}

    // const id = uuidv4();
    const connection = getConnection();
      const id = uuidv4();
      const junkTicketRepository = connection.getRepository(JunkTicket);
      const newJunkTicket = junkTicketRepository.create({
        subject: messageData.headers.subject[0],
        senderEmail: Sender,
        body: messageData.body,
        id: id,
      });
      try {
        
     const savedJunkTicket = await junkTicketRepository.save(newJunkTicket);
     if(!savedJunkTicket){
      console.log("Faild to create a junk ticket.");
     }
      await sendEmail(config.email.systemEmail , newJunkTicket.senderEmail , "Successfully created a ticket!" ,`<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">

      <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      
          <p>Hello, ${senderEmail.split('@')[0]}</p>
      
          <p>
          You have successfully created a ticket , please patiently wait until we address you issue!
          </>
      
          <a href="http://localhost:3001/localhost" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Click here to see detail</a>
      
          <p>Thank you!</p>` , "cc" )
      } catch (error) {
        console.log("Error Saving THe Data to DB:",error);
      }
    // }

    // Mark the message as seen (read) to avoid processing it again in the future
    const msgSeqNo = parseInt(messageData.prefix.match(/\d+/)[0]);
    imap.addFlags(msgSeqNo, '\\Seen');
  } catch (error) {
    console.log('Error saving email to database:', error);
  }
}
