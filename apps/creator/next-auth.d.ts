import "next-auth";
import { TPlan, TRole } from "./app/constants";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
      id: string;
      role: TRole;
      plan: TPlan;
      createdAt: Date;
    };
  }
}
