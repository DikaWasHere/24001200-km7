const { PrismaClient } = require("@prisma/client");
const imageKit = require("../libs/imageKit");
const prisma = new PrismaClient();

class mediaControllers {
  static async tambahImage(req, res) {
    try {
      // Mencegah upload tanpa file / file 0
      if (!req.file || req.file.length === 0) {
        res.status(400).json({
          message: "Bad request",
          error: "No file uploaded",
        });
        return;
      }

      let stringFile = req.file.buffer.toString("base64");

      const uploadImage = await imageKit.upload({
        fileName: req.file.originalname,
        file: stringFile,
      });

      if (uploadImage && uploadImage.url) {
        const resultAdd = await prisma.image.create({
          data: {
            judul: req.body.judul || req.file.originalname,
            imageUrl: uploadImage.url,
            deskripsi: req.body.deskripsi || "ini gambar",
          },
        });
        res.status(201).json(resultAdd);
      } else {
        res.status(400).json({
          message: "Bad request",
          error: "Failed to upload image",
        });
      }
    } catch (error) {
      console.error(error, "===> INI ERROR tambahImage");
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async getAllImage(req, res) {
    try {
      const image = await prisma.image.findMany({
        orderBy: { id: "asc" },
      });
      res.json(image);
    } catch (error) {
      console.error(error, "===> INI ERROR");
      res.status(500).json({
        message: "Gagal",
        error: error.message,
      });
    }
  }

  static async getImageId(req, res) {
    try {
      const { params } = req;
      const image = await prisma.image.findUnique({
        where: { id: Number(params.id) },
      });
      res.json(image);
    } catch (error) {
      console.error(error, "===> INI ERROR");
      res.status(500).json({
        message: "Failed to retrieve image",
        error: error.message,
      });
    }
  }

  static async deleteImage(req, res) {
    try {
      const { id } = req.params;

      await prisma.image.delete({
        where: { id: Number(id) },
      });

      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error(error, "===> INI ERROR deleteImage");
      res.status(500).json({
        message: "Gagal menghapus image",
        error: error.message,
      });
    }
  }

  static async updateImage(req, res) {
    try {
      const { id } = req.params;
      const { judul, deskripsi } = req.body;

      if (!judul || !deskripsi) {
        return res.status(400).json({
          message: "Bad request",
          error: "judul and deskripsi dibuthkan",
        });
      }

      const updatedImage = await prisma.image.update({
        where: { id: Number(id) },
        data: {
          judul,
          deskripsi,
        },
      });

      res.json(updatedImage);
    } catch (error) {
      console.error(error, "===> INI ERROR updateImage");
      res.status(500).json({
        message: "Failed to update image",
        error: error.message,
      });
    }
  }
}

module.exports = mediaControllers;
