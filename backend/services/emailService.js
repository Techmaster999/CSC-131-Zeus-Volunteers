import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create Gmail SMTP transporter
let transporter;
let emailServiceReady = false;

try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Verify transporter configuration (non-blocking)
        transporter.verify((error, success) => {
            if (error) {
                console.error('❌ Email service configuration error:', error.message);
                console.log('⚠️  Email notifications will be disabled');
                emailServiceReady = false;
            } else {
                console.log('✅ Email service ready to send emails');
                emailServiceReady = true;
            }
        });
    } else {
        console.log('⚠️  Email credentials not configured. Email notifications disabled.');
        emailServiceReady = false;
    }
} catch (error) {
    console.error('❌ Email service initialization error:', error.message);
    console.log('⚠️  Server will continue without email functionality');
    emailServiceReady = false;
}

// ===== EMAIL TEMPLATES =====

const createEmailTemplate = (title, content) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 12px;
        }
        .event-details {
            background: white;
            padding: 15px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌟 Zeus Volunteers</h1>
        <p>${title}</p>
    </div>
    <div class="content">
        ${content}
    </div>
    <div class="footer">
        <p>This is an automated message from Zeus Volunteers</p>
        <p>© ${new Date().getFullYear()} Zeus Volunteers. All rights reserved.</p>
    </div>
</body>
</html>
`;

// ===== EMAIL SENDING FUNCTIONS =====

/**
 * Send event creation confirmation to organizer
 */
export const sendEventCreatedEmail = async (eventData, organizerEmail) => {
    if (!emailServiceReady || !transporter) {
        console.log('📧 Email service not available - skipping event created email');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const content = `
            <h2>Event Successfully Created! 🎉</h2>
            <p>Your event has been submitted and is now pending admin approval.</p>
            
            <div class="event-details">
                <h3>${eventData.eventName || eventData.title}</h3>
                <p><strong>📅 Date:</strong> ${new Date(eventData.dateTime || eventData.date).toLocaleDateString()}</p>
                <p><strong>📍 Location:</strong> ${eventData.location}</p>
                <p><strong>📋 Category:</strong> ${eventData.category}</p>
                <p><strong>📝 Details:</strong> ${eventData.details || eventData.description}</p>
            </div>
            
            <p>We'll notify you once an admin reviews your event.</p>
            <p>Thank you for organizing with Zeus Volunteers! 💜</p>
        `;

        const mailOptions = {
            from: `"Zeus Volunteers" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
            to: organizerEmail,
            subject: '✅ Event Created - Pending Approval',
            html: createEmailTemplate('Event Created Successfully', content)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Event created email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending event created email:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send event approval notification to organizer
 */
export const sendEventApprovedEmail = async (eventData, organizerEmail, adminNotes) => {
    if (!emailServiceReady || !transporter) {
        console.log('📧 Email service not available - skipping event approved email');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const content = `
            <h2>Your Event Has Been Approved! 🎊</h2>
            <p>Great news! Your event has been reviewed and approved by our admin team.</p>
            
            <div class="event-details">
                <h3>${eventData.eventName || eventData.title}</h3>
                <p><strong>📅 Date:</strong> ${new Date(eventData.dateTime || eventData.date).toLocaleDateString()}</p>
                <p><strong>📍 Location:</strong> ${eventData.location}</p>
                <p><strong>🏷️ Category:</strong> ${eventData.category}</p>
            </div>
            
            ${adminNotes ? `<p><strong>Admin Notes:</strong> ${adminNotes}</p>` : ''}
            
            <p>Your event is now live and volunteers can sign up!</p>
            <p>Keep up the great work! 🌟</p>
        `;

        const mailOptions = {
            from: `"Zeus Volunteers" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
            to: organizerEmail,
            subject: '✅ Event Approved - Now Live!',
            html: createEmailTemplate('Event Approved', content)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Event approved email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending event approved email:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send event denial notification to organizer
 */
export const sendEventDeniedEmail = async (eventData, organizerEmail, denialReason) => {
    if (!emailServiceReady || !transporter) {
        console.log('📧 Email service not available - skipping event denied email');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const content = `
            <h2>Event Review Update</h2>
            <p>Thank you for submitting your event. After review, we're unable to approve it at this time.</p>
            
            <div class="event-details">
                <h3>${eventData.eventName || eventData.title}</h3>
                <p><strong>📅 Date:</strong> ${new Date(eventData.dateTime || eventData.date).toLocaleDateString()}</p>
                <p><strong>📍 Location:</strong> ${eventData.location}</p>
            </div>
            
            ${denialReason ? `
                <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
                    <p><strong>Reason:</strong> ${denialReason}</p>
                </div>
            ` : ''}
            
            <p>If you have questions about this decision, please contact our admin team.</p>
            <p>We appreciate your interest in organizing with Zeus Volunteers. 💜</p>
        `;

        const mailOptions = {
            from: `"Zeus Volunteers" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
            to: organizerEmail,
            subject: '📋 Event Review Update',
            html: createEmailTemplate('Event Review Update', content)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Event denied email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending event denied email:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send volunteer signup confirmation
 */
export const sendVolunteerSignupConfirmation = async (eventData, volunteerEmail, volunteerName) => {
    try {
        const content = `
            <h2>You're Registered! 🎉</h2>
            <p>Hi ${volunteerName},</p>
            <p>You've successfully signed up for this volunteer event:</p>
            
            <div class="event-details">
                <h3>${eventData.eventName || eventData.title}</h3>
                <p><strong>📅 Date:</strong> ${new Date(eventData.dateTime || eventData.date).toLocaleDateString()}</p>
                <p><strong>⏰ Time:</strong> ${eventData.time}</p>
                <p><strong>📍 Location:</strong> ${eventData.location}</p>
                <p><strong>🏷️ Category:</strong> ${eventData.category}</p>
                ${eventData.details || eventData.description ? `<p><strong>📝 Details:</strong> ${eventData.details || eventData.description}</p>` : ''}
            </div>
            
            <p>We'll send you a reminder closer to the event date.</p>
            <p>Thank you for volunteering! Together we make a difference! 💪</p>
        `;

        const mailOptions = {
            from: `"Zeus Volunteers" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
            to: volunteerEmail,
            subject: `✅ Registered for ${eventData.eventName || eventData.title}`,
            html: createEmailTemplate('Registration Confirmed', content)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Volunteer signup confirmation sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending volunteer signup confirmation:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Notify organizer of new volunteer signup
 */
export const sendOrganizerVolunteerNotification = async (eventData, organizerEmail, volunteerName, volunteerEmail) => {
    try {
        const content = `
            <h2>New Volunteer Signup! 🙌</h2>
            <p>Great news! Someone just signed up for your event.</p>
            
            <div class="event-details">
                <h3>Volunteer Details</h3>
                <p><strong>👤 Name:</strong> ${volunteerName}</p>
                <p><strong>📧 Email:</strong> ${volunteerEmail}</p>
            </div>
            
            <div class="event-details">
                <h3>Event Details</h3>
                <p><strong>${eventData.eventName || eventData.title}</strong></p>
                <p><strong>📅 Date:</strong> ${new Date(eventData.dateTime || eventData.date).toLocaleDateString()}</p>
                <p><strong>📍 Location:</strong> ${eventData.location}</p>
            </div>
            
            <p>Keep up the great work organizing! 🌟</p>
        `;

        const mailOptions = {
            from: `"Zeus Volunteers" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
            to: organizerEmail,
            subject: `🙌 New Volunteer Signup - ${eventData.eventName || eventData.title}`,
            html: createEmailTemplate('New Volunteer Signup', content)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Organizer volunteer notification sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending organizer volunteer notification:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send event reminder email to volunteer
 */
export const sendEventReminderEmail = async (eventData, userEmail, userName, timeUntilEvent) => {
    if (!emailServiceReady || !transporter) {
        console.log('📧 Email service not available - skipping reminder email');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const content = `
            <h2>Event Reminder ⏰</h2>
            <p>Hi ${userName},</p>
            <p>This is a friendly reminder about your upcoming volunteer event:</p>
            
            <div class="event-details">
                <h3>${eventData.eventName || eventData.title}</h3>
                <p><strong>📅 Date:</strong> ${new Date(eventData.dateTime || eventData.date).toLocaleDateString()}</p>
                <p><strong>⏰ Time:</strong> ${eventData.time}</p>
                <p><strong>📍 Location:</strong> ${eventData.location}</p>
                <p><strong>🏷️ Category:</strong> ${eventData.category}</p>
            </div>
            
            <div style="background: #e8f4fd; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
                <p><strong>⏰ Time until event:</strong> ${timeUntilEvent}</p>
            </div>
            
            ${eventData.details || eventData.description ? `<p><strong>📝 Details:</strong> ${eventData.details || eventData.description}</p>` : ''}
            
            <p>We're counting on you! Thank you for volunteering. 💜</p>
        `;

        const mailOptions = {
            from: `"Zeus Volunteers" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `⏰ Reminder: ${eventData.eventName || eventData.title} - ${timeUntilEvent}`,
            html: createEmailTemplate('Event Reminder', content)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Event reminder email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending event reminder email:', error);
        return { success: false, error: error.message };
    }
};

export default {
    sendEventCreatedEmail,
    sendEventApprovedEmail,
    sendEventDeniedEmail,
    sendVolunteerSignupConfirmation,
    sendOrganizerVolunteerNotification,
    sendEventReminderEmail
};
