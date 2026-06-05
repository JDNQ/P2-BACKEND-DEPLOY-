import { Role } from "./role.enum";

export type JwtUserPayload = {
  sub: number;
  username: string;
  role: Role;
};
