import { PrismaClient, Role } from "@prisma/client";

export type PrismaUser = {
  id: number;
  username: string;
  email: string;
  role: Role;
};

// Helps TS understand payload/user typing without relying on Role re-exports.
export type PrismaClientWithModels = PrismaClient & {
  user: {
    findFirst: PrismaClient["user"]["findFirst"];
    findUnique: PrismaClient["user"]["findUnique"];
    create: PrismaClient["user"]["create"];
  };
};
