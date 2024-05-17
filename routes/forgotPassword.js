const crypto = require('crypto');

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(20).toString('hex'); 

  // Assuming you have a function to get your user and update them
  getUserByEmail(email).then(user => {
    if (!user) {
      return res.status(404).send('No account with that email address exists.');
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    user.save().then(() => {
      const mailOptions = {
        to: email,
        from: 'your-email@gmail.com',
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
              `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
              `http://${req.headers.host}/reset-password/${token}\n\n` +
              `If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };
      
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return res.status(500).send('Email could not be sent.');
        }
        res.status(200).send('A password reset link has been sent to ' + email);
      });
    });
  }).catch(err => {
    res.status(500).send('Error on the server.');
  });
});
