const nodemailer = require("nodemailer");
const User = require("../models/User");


exports.forgetPassword = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email: email });


        if (user) {
            otp = Math.floor(100000 + Math.random() * 900000).toString()
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "val.globalia@gmail.com",
                    pass: "ccbv ccet ekqb nobx",

                }
            })

            await transporter.sendMail({
                to: email,
                subject: "Reset Password",
                text: `Your OTP is ${otp}`
            })
            //set otp into otp field into user model with string

            user.otp = otp
            await user.save()



            return res.status(200).json({ message: "OTP sent successfullys" })
        }
        else {
            return res.status(404).json({ message: "User not found" })
        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error })

    }

}

exports.verifyOtp = async (req, res) => {
    const { email, userOtp } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.otp !== userOtp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error verifying OTP" });
    }
};



exports.resetPassword = async (req, res) => {
    const { email, newPassword, userOtp } = req.body;
    try {
        if (userOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.otp = null;
        await user.save();

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error resetting password' });
    }

}
