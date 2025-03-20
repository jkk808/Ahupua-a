/*
  Warnings:

  - Added the required column `latitude` to the `Sensor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Sensor` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sensor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "location" TEXT,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);
INSERT INTO "new_Sensor" ("id", "location", "name") SELECT "id", "location", "name" FROM "Sensor";
DROP TABLE "Sensor";
ALTER TABLE "new_Sensor" RENAME TO "Sensor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
