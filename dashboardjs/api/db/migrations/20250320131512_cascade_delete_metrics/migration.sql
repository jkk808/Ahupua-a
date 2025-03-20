-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Metric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "sensorID" INTEGER NOT NULL,
    CONSTRAINT "Metric_sensorID_fkey" FOREIGN KEY ("sensorID") REFERENCES "Sensor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Metric" ("id", "sensorID", "timestamp", "type", "value") SELECT "id", "sensorID", "timestamp", "type", "value" FROM "Metric";
DROP TABLE "Metric";
ALTER TABLE "new_Metric" RENAME TO "Metric";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
