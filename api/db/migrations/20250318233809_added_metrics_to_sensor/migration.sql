/*
  Warnings:

  - You are about to drop the `UserExample` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `location` to the `Sensor` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserExample_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserExample";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Metric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "sensorID" INTEGER NOT NULL,
    CONSTRAINT "Metric_sensorID_fkey" FOREIGN KEY ("sensorID") REFERENCES "Sensor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sensor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "location" TEXT NOT NULL
);
INSERT INTO "new_Sensor" ("id", "name") SELECT "id", "name" FROM "Sensor";
DROP TABLE "Sensor";
ALTER TABLE "new_Sensor" RENAME TO "Sensor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
