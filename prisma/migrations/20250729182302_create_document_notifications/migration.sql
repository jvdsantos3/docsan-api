-- CreateTable
CREATE TABLE "document_notifications" (
    "id" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "document_id" TEXT NOT NULL,

    CONSTRAINT "document_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_notifications_document_id_key" ON "document_notifications"("document_id");

-- AddForeignKey
ALTER TABLE "document_notifications" ADD CONSTRAINT "document_notifications_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
