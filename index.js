'use strict';

// modules
var PayloadHandler = require('uipath-webhooks').PayloadHandler;
var sgMail = require('@sendgrid/mail');

// constants
var SECRET_KEY = process.env.SECRET_KEY; 
var SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
var MAILTO = process.env.MAILTO;

// setup
var handler = new PayloadHandler(SECRET_KEY);
sgMail.setApiKey(SENDGRID_API_KEY);

// Mailer helper
function sendNotificationEmail(event) {
    var mailMessage = {
        to: MAILTO,
        from: 'noreply@domain.com',
        subject: '[ORCHESTRATOR] ' + event.Type,
        text: JSON.stringify(event, undefined, 4)
    };
    sgMail.send(mailMessage, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

// Example of Job completed event handler that filters for a specific package
handler.on('job.completed', function (event) {
    if (event.Job.Release.ProcessKey === '<SomePackageName>') {
        sendNotificationEmail(event);
    }
});

// incoming webhook handler
module.exports.WebhookHandler = function (req, res) {
    if (handler.process(req.rawBody, req.headers['x-uipath-signature']) == false) {
        // obscure response on purpose (likely an undesirable request)
        res.status(500).end();
        return;
    }
    res.status(200).end();
};
