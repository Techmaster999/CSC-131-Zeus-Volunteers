import Contact from "../models/Contact.model.js";
import { isValidObjectId } from "mongoose";

/**
 * POST /api/contact
 * Submit a contact/feedback message
 * Works for both logged-in users and anonymous visitors
 */
export const submitContactForm = async (req, res) => {
    try {
        const { message, email, name } = req.body;

        // Validate message
        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        // Create contact submission
        const contactData = {
            message: message.trim(),
            status: 'pending'
        };

        // If user is logged in, link to their account
        if (req.user?.id) {
            contactData.userId = req.user.id;
        } else {
            // For anonymous submissions, store email/name if provided
            if (email) contactData.email = email;
            if (name) contactData.name = name;
        }

        const contact = await Contact.create(contactData);

        // Log the submission (in production, you'd send an email notification)
        console.log(`📬 New contact message received (ID: ${contact._id})`);

        // NOTE: In production, this would send an email to support
        // Currently just stores in database for demonstration
        // await sendContactNotificationEmail(contact);

        res.status(201).json({
            success: true,
            message: "Thank you for your message! We appreciate your feedback.",
            data: {
                id: contact._id
            }
        });
    } catch (error) {
        console.error('❌ Error submitting contact form:', error);
        res.status(500).json({
            success: false,
            message: "Failed to submit message. Please try again."
        });
    }
};

/**
 * GET /api/contact (Admin only)
 * Get all contact submissions
 */
export const getContactSubmissions = async (req, res) => {
    try {
        const { status } = req.query;

        const query = {};
        if (status && ['pending', 'reviewed', 'resolved'].includes(status)) {
            query.status = status;
        }

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'firstName lastName email');

        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * PUT /api/contact/:id (Admin only)
 * Update contact submission status
 */
export const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid contact ID"
            });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

        const contact = await Contact.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact submission not found"
            });
        }

        res.json({
            success: true,
            message: "Status updated",
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * DELETE /api/contact/:id (Admin only)
 * Delete a contact submission
 */
export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid contact ID"
            });
        }

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact submission not found"
            });
        }

        res.json({
            success: true,
            message: "Message deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default {
    submitContactForm,
    getContactSubmissions,
    updateContactStatus,
    deleteContact
};
