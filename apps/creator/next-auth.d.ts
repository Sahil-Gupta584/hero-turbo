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
    };
    refresh_token: string;
  }
  // interface User {
  //   id: string;
  //   email: string;
  //   name: string | null;
  //   image: string | null;
  //   role: TRole; // Add role field
  // }
}
