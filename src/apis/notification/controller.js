

// // Push notification setting up
// const webpush = require('web-push'); // web push library that helps us with encryption to packats
// const vapidKeys = webpush.generateVAPIDKeys() // let's get some brand new private and public keys. 
// // const vapidPublicKey = vapidKeys.publicKey;
// // const vapidPrivateKey = vapidKeys.privateKey;

// const vapidPublicKey = "BDD_de67B2GNFoQKkYi7LgyhDGKWfCifMUZW4oBzLdQlsOhhPjmCdaDVQ7Q9ewUjTTmeuYzfdMoh3AHb_FR9daU";
// const vapidPrivateKey = "vfNstzu7uUFRlHuVg2cgW8sdHrC76QB4aCey7ezvFcw";
// // console.log("Vapid keys",vapidPublicKey,vapidPrivateKey); // if you want to depub

const notification = require('../../../utils/notification')
let tokenlist = [];

exports.newBrowser = async (req, res, next) => {
    try {
        // Get Req Body
        const { token, isSafari, auth, endpoint } = req.body
        tokenlist.push({ token: token, auth: auth, isSafari: isSafari, endpoint: endpoint });


        // Respond
        res.status(200).json({
            status: "Success",
        });
    } catch (error) {
        throw error;
    }
}

exports.notify = async (req, res, next) => {
    try {
        const payload = JSON.stringify({ title: "FloridaJS Notifications are amazing", body: "And this event was well worth the money I spent on donations!" });
        // Hit each browser that registered with us.
        notification.webpush.sendNotification(req.body.subscription, payload);
        // Respond
        res.status(200).json({
            status: "Success",
            notifications: tokenlist.length + 2 + " notification sent"
        });
    } catch (error) {
        throw error;
    }
}