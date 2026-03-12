import { sendEmailReminder, logNotification } from "@/lib/notifications";
import { createServerClient } from "@/lib/supabase";

/**
 * Test Notification Endpoint
 * POST /api/notifications/test
 *
 * Body: {
 *   userEmail: "user@example.com",
 *   peptideName: "BPC-157",
 *   dose: 200,
 *   unit: "mcg",
 *   frequency: "daily",
 *   method: "email" | "push" (default: email)
 * }
 *
 * Headers: Authorization: Bearer <YOUR_NOTIFICATION_TEST_SECRET>
 */

export async function POST(request) {
  try {
    // Verify authorization
    const authHeader = request.headers.get("authorization");
    const testSecret = process.env.NOTIFICATION_TEST_SECRET;

    if (!testSecret || authHeader !== `Bearer ${testSecret}`) {
      return Response.json(
        { error: "Unauthorized - missing or invalid NOTIFICATION_TEST_SECRET" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      userEmail,
      peptideName = "Test Peptide",
      dose = "100",
      unit = "mcg",
      frequency = "daily",
      method = "email",
    } = body;

    if (!userEmail) {
      return Response.json(
        { error: "Missing required field: userEmail" },
        { status: 400 }
      );
    }

    let result;

    if (method === "push") {
      result = await testPushNotification(userEmail, {
        peptideName,
        dose,
        unit,
        frequency,
      });
    } else {
      result = await sendEmailReminder(userEmail, {
        peptideName,
        dose,
        unit,
        frequency,
        date: new Date().toLocaleDateString(),
      });
    }

    // Log the test notification
    try {
      const supabase = createServerClient();
      if (supabase) {
        await supabase.from("notification_log").insert([
          {
            user_email: userEmail,
            type: method,
            is_test: true,
            data: {
              peptideName,
              dose,
              unit,
              frequency,
            },
            sent_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (logError) {
      console.warn("Could not log test notification:", logError);
    }

    return Response.json({
      success: result.success,
      message: result.message,
      details: {
        recipient: userEmail,
        method,
        peptide: peptideName,
        dose: `${dose} ${unit}`,
        frequency,
      },
    });
  } catch (error) {
    console.error("Test notification error:", error);
    return Response.json(
      {
        error: error.message || "Failed to send test notification",
      },
      { status: 500 }
    );
  }
}

async function testPushNotification(userEmail, reminderData) {
  // This is scaffolding for push notifications
  // In production, you would:
  // 1. Get user's push subscription from database
  // 2. Use web-push library to send
  // 3. Handle errors

  console.log("Test push notification:", {
    recipient: userEmail,
    data: reminderData,
  });

  return {
    success: true,
    message:
      "Push notification test queued (implementation needed with web-push library)",
  };
}

/**
 * GET endpoint to check notification configuration
 */
export async function GET() {
  const config = {
    emailProviders: {
      resend: !!process.env.RESEND_API_KEY,
      sendgrid: !!process.env.SENDGRID_API_KEY,
      gmail: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
    },
    pushNotifications: {
      configured: !!(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
        process.env.VAPID_PRIVATE_KEY
      ),
    },
    testSecretConfigured: !!process.env.NOTIFICATION_TEST_SECRET,
  };

  const activeProvider =
    Object.entries(config.emailProviders).find(([_, enabled]) => enabled)?.[0] ||
    "none";

  return Response.json({
    status: "ok",
    config,
    activeEmailProvider: activeProvider,
    nextSteps:
      activeProvider === "none"
        ? [
            "1. Add RESEND_API_KEY, SENDGRID_API_KEY, or EMAIL_USER/EMAIL_PASS to .env.local",
            "2. Add NOTIFICATION_TEST_SECRET to .env.local",
            "3. Test with POST /api/notifications/test",
          ]
        : ["Email provider ready", "Set NOTIFICATION_TEST_SECRET to enable test endpoint"],
  });
}
