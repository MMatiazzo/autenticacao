-- CreateTable
CREATE TABLE "medico" (
    "crm" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "medico_pkey" PRIMARY KEY ("crm")
);

-- CreateTable
CREATE TABLE "paciente" (
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "paciente_pkey" PRIMARY KEY ("cpf")
);

-- CreateIndex
CREATE UNIQUE INDEX "medico_email_key" ON "medico"("email");

-- CreateIndex
CREATE UNIQUE INDEX "paciente_email_key" ON "paciente"("email");
