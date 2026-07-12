import bcrypt from "bcryptjs";
import { userRepository } from "@/lib/repositories";
import { setSession, clearSession, SessionPayload } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations";

export const authService = {
  async login(data: { email: string; password: string }) {
    const parsed = loginSchema.parse(data);
    const user = await userRepository.findByEmail(parsed.email);
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(parsed.password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const payload: SessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    await setSession(payload);
    return payload;
  },

  async register(data: { name: string; email: string; password: string; role: string }) {
    const parsed = registerSchema.parse(data);
    const existing = await userRepository.findByEmail(parsed.email);
    if (existing) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(parsed.password, 12);
    const user = await userRepository.create({
      name: parsed.name,
      email: parsed.email,
      password: hashedPassword,
      role: parsed.role,
    });

    const payload: SessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    await setSession(payload);
    return payload;
  },

  async logout() {
    await clearSession();
  },
};
