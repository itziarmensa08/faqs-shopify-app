/*
  Warnings:

  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `user` on the `FAQ` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Answer";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FAQ" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_FAQ" ("createdAt", "id", "question", "shop") SELECT "createdAt", "id", "question", "shop" FROM "FAQ";
DROP TABLE "FAQ";
ALTER TABLE "new_FAQ" RENAME TO "FAQ";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
