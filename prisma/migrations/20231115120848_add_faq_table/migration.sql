/*
  Warnings:

  - Added the required column `shop` to the `FAQ` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FAQ" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "user" TEXT,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_FAQ" ("createdAt", "id", "question", "user") SELECT "createdAt", "id", "question", "user" FROM "FAQ";
DROP TABLE "FAQ";
ALTER TABLE "new_FAQ" RENAME TO "FAQ";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
