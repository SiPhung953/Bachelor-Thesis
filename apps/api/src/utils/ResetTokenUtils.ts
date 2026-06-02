import crypto from "node:crypto";

export class ResetTokenUtils {
  public static generate(): string {
    return crypto.randomBytes(32).toString("base64url");
  }

  public static hash(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}
