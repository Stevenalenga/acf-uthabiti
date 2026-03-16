export function contactAutoReplyTemplate({ name }) {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f6f6f6;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
                <td align="center" style="background:#E5553C;padding:20px;">
                    <span style="
                    font-family: Arial, sans-serif;
                    font-size:28px;
                    font-weight:bold;
                    color:#ffffff;
                    letter-spacing:2px;
                    ">
                    Uthabiti Africa
                    </span>
                </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;color:#333;">
                <h2 style="margin-top:0;">Thank You for Contacting Us</h2>
                <p>Hello ${name || "there"},</p>

                <p>We have received your message successfully.  
                One of our team members will get back to you shortly.</p>

                <p>If your inquiry is urgent, you can reply directly to this email.</p>

                <p style="margin-top:30px;">Warm regards,<br><strong> Uthabiti Support Team</strong></p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#f0f0f0;padding:15px;font-size:12px;color:#777;">
                © ${new Date().getFullYear()} Uthabiti Africa. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

export const newsletterTemplate = ({ unsubscribeUrl }) => `
<div style="font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; padding:40px 20px;">

  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e5e5e5;">

    <!-- Header -->
    <div style="background:#ea580c; padding:24px; text-align:center; color:white;">
      <h1 style="margin:0; font-size:22px;">ACF Mombasa 2026 Updates</h1>
    </div>

    <!-- Body -->
    <div style="padding:30px;">

      <p style="font-size:16px;">
        Welcome to the <strong>Africa Childcare Forum</strong> newsletter 🎉
      </p>

      <p style="font-size:15px; line-height:1.6;">
        Thank you for subscribing to receive updates about the upcoming 
        <strong>ACF Mombasa 2026</strong>. We are excited to keep you informed 
        about everything leading up to the forum.
      </p>

      <!-- Updates Box -->
      <div style="margin:25px 0; border:1px solid #eee; border-radius:6px; padding:20px; background:#fafafa;">
        <h3 style="margin-top:0; color:#333;">What you'll receive</h3>

        <ul style="margin:0; padding-left:18px; font-size:14px; line-height:1.8;">
          <li>Speaker announcements</li>
          <li>Programme updates</li>
          <li>Registration deadlines</li>
          <li>Forum highlights</li>
        </ul>
      </div>

      <p style="font-size:14px; line-height:1.6;">
        We look forward to welcoming you to the forum in 
        <strong>Mombasa, Kenya</strong>.
      </p>

      <p style="margin-top:25px;">
        Best regards,<br/>
        <strong>ACF Mombasa 2026 Secretariat</strong>
      </p>

    </div>

    <!-- Footer -->
    <div style="background:#fafafa; padding:20px; text-align:center; font-size:12px; color:#777;">

      <p style="margin:0 0 8px 0;">
        You are receiving this email because you subscribed to ACF updates.
      </p>

      <p style="margin:0 0 10px 0;">
        If you no longer wish to receive updates, you can unsubscribe below.
      </p>

      <a 
        href="${unsubscribeUrl}" 
        style="
          display:inline-block;
          padding:8px 14px;
          background:#fff;
          border:1px solid #ea580c;
          color:#ea580c;
          text-decoration:none;
          border-radius:4px;
          font-size:12px;
        "
      >
        Unsubscribe
      </a>

      <p style="margin-top:12px;">
        © ${new Date().getFullYear()} Africa Childcare Forum
      </p>

    </div>

  </div>
</div>
`;

export const conferenceRegistrationTemplate = ({
  name,
  phase,
  type,
  amount,
  paymentStatus,
}) => {

  const phaseLabel = {
    EarlyBird: "Early Bird",
    Regular: "Regular",
    LateOnsite: "Late / On-site",
  };

  const typeLabel = {
    student: "Student",
    eastAfrica: "East Africa Participant",
    other: "International Participant",
  };

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; padding:40px 20px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e5e5e5;">
      
      <!-- Header -->
      <div style="background:#ea580c; padding:24px; text-align:center; color:white;">
        <h1 style="margin:0; font-size:22px;">ACF Mombasa 2026 Conference Registration Confirmation</h1>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        
        <p style="font-size:16px;">Hello <strong>${name}</strong>,</p>

        <p style="font-size:15px; line-height:1.6;">
          Thank you for registering for our upcoming ACF Mombasa 2026. We are excited to have you join us!
        </p>

        <!-- Registration Details -->
        <div style="margin:25px 0; border:1px solid #eee; border-radius:6px; padding:20px; background:#fafafa;">
          
          <h3 style="margin-top:0; color:#333;">Registration Details</h3>

          <table style="width:100%; font-size:14px; border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0; color:#555;">Registration Phase:</td>
              <td style="padding:6px 0;"><strong>${phaseLabel[phase]}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Participant Type:</td>
              <td style="padding:6px 0;"><strong>${typeLabel[type]}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Registration Fee:</td>
              <td style="padding:6px 0;"><strong>$${amount}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Payment Status:</td>
              <td style="padding:6px 0;">
                <strong style="color:${
                  paymentStatus === "SUCCESS"
                    ? "#16a34a"
                    : "#f59e0b"
                };">
                  ${paymentStatus}
                </strong>
              </td>
            </tr>
          </table>

        </div>

        ${
          paymentStatus === "PENDING"
            ? `
        <p style="font-size:14px; line-height:1.6;">
          ${
            phase === "LateOnsite"
              ? "Your payment will be completed at the conference venue during check-in."
              : "Please complete your payment to confirm your participation. Once payment is successful, you will receive a payment confirmation email."
          }
        </p>
        `
            : ""
        }

        <p style="font-size:14px; line-height:1.6;">
          If you have any questions regarding your registration, please contact our team.
        </p>

        <p style="margin-top:25px;">
          We look forward to welcoming you to the conference.
        </p>

        <p>
          Best regards,<br/>
          <strong>Conference Organizing Team</strong>
        </p>

      </div>

      <!-- Footer -->
      <div style="background:#fafafa; padding:18px; text-align:center; font-size:12px; color:#777;">
        © ${new Date().getFullYear()} Conference Secretariat<br/>
        This email confirms your conference registration.
      </div>

    </div>
  </div>
  `;
};

export const paymentSuccessTemplate = ({
  name,
  phase,
  type,
  amount,
  reference,
}) => {

  const phaseLabel = {
    EarlyBird: "Early Bird",
    Regular: "Regular",
    LateOnsite: "Late / On-site",
  };

  const typeLabel = {
    student: "Student",
    eastAfrica: "East Africa Participant",
    other: "International Participant",
  };

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; padding:40px 20px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e5e5e5;">
      
      <div style="background:#ea580c; padding:24px; text-align:center; color:white;">
        <h1 style="margin:0; font-size:22px;">Payment Confirmation</h1>
      </div>

      <div style="padding:30px;">
        
        <p style="font-size:16px;">Hello <strong>${name}</strong>,</p>

        <p style="font-size:15px; line-height:1.6;">
          Your payment has been successfully received. Your registration for ACF Mombasa 2026 is now fully confirmed.
        </p>

        <div style="margin:25px 0; border:1px solid #eee; border-radius:6px; padding:20px; background:#fafafa;">
          
          <h3 style="margin-top:0; color:#333;">Payment Details</h3>

          <table style="width:100%; font-size:14px; border-collapse:collapse;">

            <tr>
              <td style="padding:6px 0; color:#555;">Registration Phase:</td>
              <td style="padding:6px 0;"><strong>${phaseLabel[phase]}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Participant Type:</td>
              <td style="padding:6px 0;"><strong>${typeLabel[type]}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Amount Paid:</td>
              <td style="padding:6px 0;"><strong>$${amount}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Payment Reference:</td>
              <td style="padding:6px 0;"><strong>${reference}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Payment Status:</td>
              <td style="padding:6px 0;">
                <strong style="color:#16a34a;">SUCCESS</strong>
              </td>
            </tr>

          </table>

        </div>

        <p style="font-size:14px; line-height:1.6;">
          Thank you for confirming your participation. Further conference updates will be sent to you as the event approaches.
        </p>

        <p>
          Best regards,<br/>
          <strong>Conference Organizing Team</strong>
        </p>

      </div>

      <div style="background:#fafafa; padding:18px; text-align:center; font-size:12px; color:#777;">
        © ${new Date().getFullYear()} Conference Secretariat<br/>
        This email confirms your successful payment.
      </div>

    </div>
  </div>
  `;
};

export const paymentFailedTemplate = ({
  name,
  phase,
  type,
  amount,
  reference,
}) => {

  const phaseLabel = {
    EarlyBird: "Early Bird",
    Regular: "Regular",
    LateOnsite: "Late / On-site",
  };

  const typeLabel = {
    student: "Student",
    eastAfrica: "East Africa Participant",
    other: "International Participant",
  };

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; padding:40px 20px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e5e5e5;">
      
      <div style="background:#ea580c; padding:24px; text-align:center; color:white;">
        <h1 style="margin:0; font-size:22px;">Payment Attempt Failed</h1>
      </div>

      <div style="padding:30px;">
        
        <p style="font-size:16px;">Hello <strong>${name}</strong>,</p>

        <p style="font-size:15px; line-height:1.6;">
          Unfortunately, your payment attempt for the conference registration could not be completed.
        </p>

        <div style="margin:25px 0; border:1px solid #eee; border-radius:6px; padding:20px; background:#fafafa;">
          
          <h3 style="margin-top:0; color:#333;">Payment Attempt Details</h3>

          <table style="width:100%; font-size:14px; border-collapse:collapse;">

            <tr>
              <td style="padding:6px 0; color:#555;">Registration Phase:</td>
              <td style="padding:6px 0;"><strong>${phaseLabel[phase]}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Participant Type:</td>
              <td style="padding:6px 0;"><strong>${typeLabel[type]}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Amount:</td>
              <td style="padding:6px 0;"><strong>$${amount}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Payment Reference:</td>
              <td style="padding:6px 0;"><strong>${reference}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Payment Status:</td>
              <td style="padding:6px 0;">
                <strong style="color:#dc2626;">FAILED</strong>
              </td>
            </tr>

          </table>

        </div>

        <p style="font-size:14px; line-height:1.6;">
          Please try completing your payment again to confirm your participation.
        </p>

        <p>
          Best regards,<br/>
          <strong>Conference Organizing Team</strong>
        </p>

      </div>

      <div style="background:#fafafa; padding:18px; text-align:center; font-size:12px; color:#777;">
        © ${new Date().getFullYear()} Conference Secretariat<br/>
        Payment attempt was not successful.
      </div>

    </div>
  </div>
  `;
};

export const paymentNotVerifiedTemplate = ({
  name,
  phase,
  type,
  amount,
  reference,
}) => {

  const phaseLabel = {
    EarlyBird: "Early Bird",
    Regular: "Regular",
    LateOnsite: "Late / On-site",
  };

  const typeLabel = {
    student: "Student",
    eastAfrica: "East Africa Participant",
    other: "International Participant",
  };

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; padding:40px 20px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e5e5e5;">
      
      <div style="background:#ea580c; padding:24px; text-align:center; color:white;">
        <h1 style="margin:0; font-size:22px;">Payment Pending</h1>
      </div>

      <div style="padding:30px;">
        
        <p style="font-size:16px;">Hello <strong>${name}</strong>,</p>

        <p style="font-size:15px; line-height:1.6;">
          We noticed that your payment process for the conference registration was not completed.
        </p>

        <div style="margin:25px 0; border:1px solid #eee; border-radius:6px; padding:20px; background:#fafafa;">
          
          <h3 style="margin-top:0; color:#333;">Registration Details</h3>

          <table style="width:100%; font-size:14px; border-collapse:collapse;">

            <tr>
              <td style="padding:6px 0; color:#555;">Registration Phase:</td>
              <td style="padding:6px 0;"><strong>${phaseLabel[phase]}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Participant Type:</td>
              <td style="padding:6px 0;"><strong>${typeLabel[type]}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Registration Fee:</td>
              <td style="padding:6px 0;"><strong>$${amount}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Payment Reference:</td>
              <td style="padding:6px 0;"><strong>${reference}</strong></td>
            </tr>

            <tr>
              <td style="padding:6px 0; color:#555;">Payment Status:</td>
              <td style="padding:6px 0;">
                <strong style="color:#f59e0b;">NOT COMPLETED</strong>
              </td>
            </tr>

          </table>

        </div>

        <p style="font-size:14px; line-height:1.6;">
          Your registration is still pending payment. Please complete your payment to confirm your participation.
        </p>

        <p>
          Best regards,<br/>
          <strong>Conference Organizing Team</strong>
        </p>

      </div>

      <div style="background:#fafafa; padding:18px; text-align:center; font-size:12px; color:#777;">
        © ${new Date().getFullYear()} Conference Secretariat<br/>
        Payment confirmation is pending.
      </div>

    </div>
  </div>
  `;
};
