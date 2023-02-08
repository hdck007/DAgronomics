-- CreateTable
CREATE TABLE "Bidrequests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "user" TEXT NOT NULL,
    "type" TEXT NOT NULL
);
