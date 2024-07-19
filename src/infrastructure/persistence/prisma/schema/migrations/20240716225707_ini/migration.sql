/*
  Warnings:

  - Added the required column `especialidade` to the `medico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medico" ADD COLUMN     "especialidade" TEXT NOT NULL;
