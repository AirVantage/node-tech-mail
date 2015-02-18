var _ = require("lodash");
var emailTemplates = require("email-templates");
var logger = require("node-tech-logger");
var nodemailer = require("nodemailer");
var sgTransport = require("nodemailer-sendgrid-transport");
var stubTransport = require("nodemailer-stub-transport");

/**
 * @param  {String}     configuration.mail.server.user
 * @param  {String}     configuration.mail.server.password
 * @param  {String}     configuration.mail.sender
 * @param  {Boolean}    configuration.mail.stub_transport
 */
module.exports = function(configuration, templatesDir) {
    var transporter;

    if (configuration.mail.stub_transport === false) {
        var options = {
            auth: {
                api_user: configuration.mail.server.user,
                api_key: configuration.mail.server.password
            }
        };
        // Create reusable transporter object using SMTP transport
        // No need to recreate the transporter object. You can use the same transporter object for all e-mails
        transporter = nodemailer.createTransport(sgTransport(options));
    } else {
        logger.info("[tech-mail] Using stub transport");
        transporter = nodemailer.createTransport(stubTransport());
    }

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
                                    if (configuration.mail.stub_transport === false) {
                                        logger.info("Message status:", info.message);
                                    } else {
                                        logger.info("Message sent. Envelope: ", info.envelope);
                                        logger.debug("Message response:", info.response.toString());
                                    }
                                }
                            });
                        }
                    });

                }
            });
        }
    };
};
