
const Imap = require('imap');
const { inspect } = require('util');
const { getConnection } = require('typeorm');
const User = require('../../models/User');
const Ticket = require('../../models/Ticket');
const JunkTicket = require('../../models/JunkTicket');
const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const { simpleParser } = require('mailparser');

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
      openInbox(function(err, box) {
        if (err) throw err;

        const fetchRange = getFetchRange(box);

        var f = imap.seq.fetch(fetchRange, {
          bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', ''],
          struct: true,
        });

        f.on('message', async function(msg, seqno) {
          console.log('Message #%d', seqno);
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
              console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
              messageData.headers = Imap.parseHeader(buffer);
            });
          });

          // Extract attributes (flags) of the message
          msg.once('attributes', async function(attrs) {
            console.log(prefix + 'Attributes: %s', await inspect(attrs, false, 12));
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
              console.log(prefix + 'Body: %s', buffer);
              // Parse the email using mailparser
      const parsedEmail = await simpleParser(buffer);
              messageData.body = parsedEmail.text ;
              // console.log("---------------------------")
              console.log( "Body Buffer",parsedEmail.text || '')
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

//     console.log("senderEmail" ,senderEmail);
    const id = uuidv4();
    const connection = getConnection();
    const userRepository = connection.getRepository(User);
    const user = await userRepository.findOne({
      where: { email: Sender }
    });

    if (user) {
      const ticketRepository = connection.getRepository(Ticket);
      const newTicket = ticketRepository.create({
        subject: messageData.headers.subject[0],
        description: messageData.body,
        id: id,
        status: Sender,
        priority: "high",
      });
      try {
        
      await ticketRepository.save(newTicket);
      } catch (error) {
        console.log("ERros Saving THe data to DB ::" , error);
      }
    } else {
      const id = uuidv4();
      const junkTicketRepository = connection.getRepository(JunkTicket);
      const newJunkTicket = junkTicketRepository.create({
        subject: messageData.headers.subject[0],
        senderEmail: Sender,
        body: messageData.body,
        id: id,
      });
      try {
        
      await junkTicketRepository.save(newJunkTicket);
      } catch (error) {
        console.log("Error Saving THe Data to DB:",error);
      }
    }

    // Mark the message as seen (read) to avoid processing it again in the future
    const msgSeqNo = parseInt(messageData.prefix.match(/\d+/)[0]);
    imap.addFlags(msgSeqNo, '\\Seen');
  } catch (error) {
    console.log('Error saving email to database:', error);
  }
}
