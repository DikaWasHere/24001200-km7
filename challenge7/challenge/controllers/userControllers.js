const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let SECRET_ACCESS_JWT = process.env.SECRET_ACCESS_JWT;

class UserControllers {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      //console.log({name, email, password}, "==> req body");
      const cekEmail = await prisma.user.findUnique({
        where: { email: email },
      });

      if (cekEmail) {
        return res.status(400).json({ message: "Terdapat email yang sama" });
      }

      const encryptPassword = await bcrypt.hashSync(password, 10);

      const saveData = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: encryptPassword,
        },
      });
      console.log(saveData, "==> saveData");
      res.send("Anda berhasil Register");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something wrong i can feel it" });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const findUser = await prisma.user.findUnique({
        where: { email: email },
      });

      let cekPassword = await bcrypt.compareSync(password, findUser.password);

      if (!findUser) {
        return res.status(404).send("User tidak ditemukan");
      }
      if (!cekPassword) {
        return res.status(401).send("Wrong password");
      }

      const accessToken = jwt.sign(
        {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
        },
        SECRET_ACCESS_JWT
      );

      //res.send(`Selamat Datang ${findUser.name} Anda berhasil masuk`);
      res.status(200).json({
        message: `Selamat ${findUser.name}, Anda berhasil login`,
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something wrong i can feel it" });
    }
  }

  static async forgetPassword(req, res) {
    const { email } = req.body;

    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Check if user exists
      if (!user) {
        return res.status(404).json({
          message: "User not found with this email",
        });
      }

      // Generate a random reset token
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Store reset token with expiration (valid for 1 hour)
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Update user with reset token and expiry
      await prisma.user.update({
        where: { email },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Send password reset email (you'll need to implement email sending logic)
      await sendPasswordResetEmail(user.email, resetToken);

      res.status(200).json({
        message: "Password reset link has been sent to your email",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Error processing password reset request",
        error: err.message,
      });
    }
  }
}

module.exports = UserControllers;
