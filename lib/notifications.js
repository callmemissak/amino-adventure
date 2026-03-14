// Notification Service
// Provides email and push notification capabilities

import { createServerClient } from "./supabase";

/**
 * Send email reminder
 * @param {string} userEmail - User's email address
 * @param {Object} reminderData - { peptideName, dose, unit, frequency, date }
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendEmailReminder(userEmail, reminderData) {
  try {
    // Option 1: Using Resend API
    if (process.env.RESEND_API_KEY) {
      return await sendEmailViaResend(userEmail, reminderData);
    }

    // Option 2: Using SendGrid API
    if (process.env.SENDGRID_API_KEY) {
      return await sendEmailViaSendGrid(userEmail, reminderData);
    }

    // Option 3: Using nodemailer (Gmail SMTP)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      return await sendEmailViaNodemailer(userEmail, reminderData);
    }

    return {
      success: false,
      message: "No email provider configured (Resend/SendGrid/Gmail SMTP)",
    };
  } catch (error) {
    console.error("Email reminder error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Send push notification to registered users
 * @param {string} userId - User ID
 * @param {Object} notificationData - { title, body, data }
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendPushNotification(userId, notificationData) {
  try {
    const supabase = createServerClient();
    if (!supabase) {
      return {
        success: false,
        message: "Supabase not configured",
      };
    }

    // Get user's push subscription
    const { data: subscription, error } = await supabase
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", userId)
      .single();

    if (error || !subscription) {
      return {
        success: false,
        message: "User not subscribed to push notifications",
      };
    }

    // Send via Web Push API (requires web-push library)
    // This is scaffolding - implement with your push service
    console.log("Push notification would be sent to:", userId, notificationData);

    return {
      success: true,
      message: "Push notification queued",
    };
  } catch (error) {
    console.error("Push notification error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Record notification in audit log
 */
export async function logNotification(userId, type, data) {
  try {
    const supabase = createServerClient();
    if (!supabase) return;

    await supabase.from("notification_log").insert([
      {
        user_id: userId,
        type,
        data,
        sent_at: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    console.error("Error logging notification:", error);
  }
}

// ============ EMAIL IMPLEMENTATIONS ============

async function sendEmailViaResend(userEmail, reminderData) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const emailHtml = generateReminderEmail(reminderData);

  try {
    const result = await resend.emails.send({
      from: "noreply@peptabase.com",
      to: userEmail,
      subject: `PeptaBase: ${reminderData.peptideName} Reminder`,
      html: emailHtml,
    });

    if (result.error) {
      throw result.error;
    }

    return {
      success: true,
      message: "Email sent via Resend",
    };
  } catch (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}

async function sendEmailViaSendGrid(userEmail, reminderData) {
  const sgMail = await import("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const emailHtml = generateReminderEmail(reminderData);

  try {
    await sgMail.send({
      to: userEmail,
      from: "noreply@peptabase.com",
      subject: `PeptaBase: ${reminderData.peptideName} Reminder`,
      html: emailHtml,
    });

    return {
      success: true,
      message: "Email sent via SendGrid",
    };
  } catch (error) {
    throw new Error(`SendGrid error: ${error.message}`);
  }
}

async function sendEmailViaNodemailer(userEmail, reminderData) {
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailHtml = generateReminderEmail(reminderData);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `PeptaBase: ${reminderData.peptideName} Reminder`,
      html: emailHtml,
    });

    return {
      success: true,
      message: "Email sent via Gmail SMTP",
    };
  } catch (error) {
    throw new Error(`Nodemailer error: ${error.message}`);
  }
}

// ============ EMAIL TEMPLATE ============

function generateReminderEmail(reminderData) {
  const {
    peptideName = "Peptide",
    dose = "0",
    unit = "mg",
    frequency = "N/A",
    date = new Date().toLocaleDateString(),
  } = reminderData;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #e2ddd5; background: #08080f; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0a0a10; border-left: 4px solid #34d399; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .header h2 { margin: 0; color: #34d399; }
          .content { background: #1a1a2e; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .dosage { background: #0a0a10; padding: 15px; border-left: 3px solid #34d399; margin: 15px 0; }
          .button { background: #34d399; color: #08080f; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block; margin-top: 20px; font-weight: bold; }
          .footer { font-size: 12px; color: #aaa; text-align: center; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>PeptaBase Reminder</h2>
          </div>

          <div class="content">
            <p>Time to log your <strong>${peptideName}</strong> injection!</p>

            <div class="dosage">
              <p><strong>${dose} ${unit}</strong></p>
              <p>Frequency: ${frequency}</p>
              <p>Date: ${date}</p>
            </div>

            <p>Log your injection and add notes about how you're feeling:</p>

            <a href="https://peptabase.com/dashboard" class="button">
              Log Injection →
            </a>
          </div>

          <div class="footer">
            <p>PeptaBase - Research Tracking Platform</p>
            <p>This is an automated reminder. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
