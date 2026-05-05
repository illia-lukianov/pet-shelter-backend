-- CreateTable
CREATE TABLE "WalkRequest" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT,
    "message" TEXT,
    "dogId" INTEGER NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalkRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WalkRequest" ADD CONSTRAINT "WalkRequest_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalkRequest" ADD CONSTRAINT "WalkRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
