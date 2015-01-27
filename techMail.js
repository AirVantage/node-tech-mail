var _ = require("underscore");
var nodemailer = require("nodemailer");
var sgTransport = require("nodemailer-sendgrid-transport");
var emailTemplates = require('email-templates');
var logger = require("node-tech-logger");

/**
 * @param  {String}     configuration.mail.server.host
 * @param  {Integer}    configuration.mail.server.port
 * @param  {String}     configuration.mail.sender
 */
module.exports = function(configuration, templatesDir) {
    var options = {
        auth: {
            api_user: configuration.mail.server.api_user,
            api_key: configuration.mail.server.api_key
        }
    };
    // Create reusable transporter object using SMTP transport
    // No need to recreate the transporter object. You can use the same transporter object for all e-mails
    var transporter = nodemailer.createTransport(sgTransport(options));

    return {
        sendMail: function(options, locals) {

            emailTemplates(templatesDir, function(err, template) {
                if (err) {
                    logger.error(err);
                } else {
                    template(options.template, locals, function(err, html, text) {
                        if (err) {
                            logger.error(err);
                        } else {

                            var mailOptions = _.extend({
                                from: configuration.mail.sender,
                                html: html,
                                text: text
                            }, options);
                            // Send mail with defined transport object
                            transporter.sendMail(mailOptions, function(error, info) {
                                if (error) {
                                    logger.error(error);
                                } else {
                                    logger.info("Message status: " + info.message);
                                }
                            });
                        }
                    });

                }
            });
        }
    };
};
