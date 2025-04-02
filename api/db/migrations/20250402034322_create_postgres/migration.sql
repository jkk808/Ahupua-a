-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "location" TEXT,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metric" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "sensorID" INTEGER NOT NULL,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_sensorID_fkey" FOREIGN KEY ("sensorID") REFERENCES "Sensor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
