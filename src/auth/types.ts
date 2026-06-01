import { Role } from "@prisma/client";

export type JwtUserPayload = {
  sub: number;
  username: string;
  role: Role;
};
