-- CreateTable
CREATE TABLE "image" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);
