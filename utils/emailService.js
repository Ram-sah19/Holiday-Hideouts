// Note: Install nodemailer package first
// npm install nodemailer

let transporter = null;

try {
    const nodemailer = require('nodemailer');
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
} catch (error) {
    console.log('Nodemailer not installed. Email notifications disabled.');
}

const emailService = {
    async sendBookingConfirmation(booking, user, listing) {
        if (!transporter) {
            console.log('Email service not available');
            return;
        }
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Booking Confirmation - Wanderlust',
            html: `
                <h2>Booking Confirmed!</h2>
                <p>Dear ${user.username},</p>
                <p>Your booking has been confirmed.</p>
                <h3>Booking Details:</h3>
                <ul>
                    <li><strong>Property:</strong> ${listing.title}</li>
                    <li><strong>Location:</strong> ${listing.location}, ${listing.country}</li>
                    <li><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</li>
                    <li><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</li>
                    <li><strong>Guests:</strong> ${booking.guests}</li>
                    <li><strong>Total Price:</strong> ₹${booking.totalPrice.toLocaleString('en-IN')}</li>
                </ul>
                <p>Thank you for choosing Wanderlust!</p>
            `
        };
        
        try {
            await transporter.sendMail(mailOptions);
            console.log('Booking confirmation email sent');
        } catch (error) {
            console.error('Email error:', error);
        }
    },
    
    async sendCancellationEmail(booking, user, listing) {
        if (!transporter) {
            console.log('Email service not available');
            return;
        }
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Booking Cancelled - Wanderlust',
            html: `
                <h2>Booking Cancelled</h2>
                <p>Dear ${user.username},</p>
                <p>Your booking for ${listing.title} has been cancelled.</p>
                <p>If you have any questions, please contact us.</p>
            `
        };
        
        try {
            await transporter.sendMail(mailOptions);
            console.log('Cancellation email sent');
        } catch (error) {
            console.error('Email error:', error);
        }
    }
};

module.exports = emailService;
