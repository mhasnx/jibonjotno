import bcrypt from "bcryptjs";

// পাসওয়ার্ড হেশ করার ফাংশন (Admin / User registration-এর সময়)
export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(plainPassword, saltRounds);
}

// পাসওয়ার্ড যাচাই করার ফাংশন (Login-এর সময়)
export async function verifyPassword(plainPassword: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashed);
}