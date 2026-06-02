import { compare, hash } from "bcrypt";

export class PasswordHasher {
  public async hash(password: string): Promise<string> {
    const hashedPassword = await hash(password, 10)
    return hashedPassword
  }

  public async compare(password: string, passwordHash: string): Promise<boolean> {
    const compareResult = await compare(password, passwordHash)
    return compareResult
  }
}