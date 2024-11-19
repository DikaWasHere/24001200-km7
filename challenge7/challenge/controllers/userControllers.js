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
      // res.send("Anda berhasil Register");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Terjadi kesalahan" });
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

      res.status(200).json({
        message: `Selamat ${findUser.name}, Anda berhasil login`,
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Terjadi kesalahan" });
    }
  }

  static async forgetPasswordPage(req, res) {
    res.render("forgetPassword"); // Menampilkan halaman forget password
  }

  static async forgetPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "Email tidak ditemukan" });
      }

      // Generate reset token (15 menit valid)
      const resetToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.SECRET_ACCESS_JWT,
        { expiresIn: "15m" }
      );

      const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

      const transporter = require("nodemailer").createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Permintaan Reset Password",
        html: `
          <h2>Reset Password</h2>
          <p>Klik link berikut untuk mereset password Anda:</p>
          <a href="${resetUrl}">Reset Password</a>
        `,
      });

      res.status(200).json({
        message: "Link reset password telah dikirim ke email Anda",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  // static async resetPasswordPage(req, res) {
  //   const { token } = req.query;

  //   try {
  //     jwt.verify(token, process.env.SECRET_ACCESS_JWT);
  //     res.render("resetPassword", { token });
  //   } catch (error) {
  //     console.error(error);
  //     res
  //       .status(400)
  //       .json({ message: "Token tidak valid atau telah kedaluwarsa" });
  //   }
  // }

  static async resetPassword(req, res) {
    const { token, newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_ACCESS_JWT);

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: decoded.id },
        data: { password: hashedPassword },
      });

      // res.status(200).json({ message: "Password berhasil direset" });
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ message: "Token tidak valid atau telah kedaluwarsa" });
    }
  }
}

module.exports = UserControllers;
