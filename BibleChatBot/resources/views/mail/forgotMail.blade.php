<!DOCTYPE html>
<html>
<head>
    <title>Password Reset Verification</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Poppins', Arial, sans-serif; color: #333; background-color: #f4f7fa; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 5px; margin-top: 5px;">

        </div>
        <h3 style="color: #ffffff; background-color: #4f5d75; text-align: center; font-size: 26px; margin-bottom: 10px;">Verification Code</h3>
        <p style="color: #555; font-size: 14px; text-align: left; margin-bottom: 20px; margin-left: 14px">
            Hello <strong>{{ $user->username }}</strong>,<br>
            You have requested a password reset. Please use the verification code below to proceed:
        </p>

        <!-- Verification Code Section -->
        <div style="padding: 10px; background-color: #f9f9f9;  font-size: 16px; text-align: center; font-weight: bold; margin-bottom: 10px;">
            <p style="margin: 0;">Verification Link:</p>
            <h2 style="margin: 1px 0; color: #D7722A; font-size: 30px;">{{ $link }}</h2>
        </div>

        <!-- Instructions -->
        <p style="color: #555; font-size: 14px; margin-bottom: 20px; margin-left: 14px">This code is valid for <strong style="color: #D7722A;">5 minutes</strong>. Please enter it on the password reset page to complete your request.</p>
        <p style="color: #555; font-size: 14px; margin-bottom: 20px; margin-left: 14px"> If you did not request a password reset, please ignore this message or contact our support team immediately.</p>

         <!-- Footer -->
         <p style="color: #555; font-size: 14px; text-align: left; margin-left: 14px">
            Sincerely,<br>
            BibleBot Team
        </p>
    </div>
     <!-- Footer -->
     <div style="max-width: 600px; margin: 20px auto; padding-bottom: 20px; text-align: center; font-size: 12px; color: #c5c2bc;">
            &copy; {{ date('Y') }} BibleBot. All rights reserved.
    </div>

    <!-- Responsive Styles -->
    <style>
        @media (max-width: 600px) {
            div {
                padding: 10px;
            }
            h2 {
                font-size: 20px;
            }
            .verification-code {
                font-size: 24px;
            }
            p {
                font-size: 14px;
            }
            .footer {
                font-size: 12px;
            }
        }

        @media (max-width: 800px) and (min-width: 601px) {
            div {
                padding: 15px;
            }
            h2 {
                font-size: 22px;
            }
            .verification-code {
                font-size: 26px;
            }
            p {
                font-size: 15px;
            }
        }
    </style>
</body>
</html>
