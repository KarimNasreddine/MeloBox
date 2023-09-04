import jwt from "jsonwebtoken";
import { cookies } from "next/dist/client/components/headers";
import { getToken } from "./token";

const secret = "karim";

export function generateToken(payload) {
  return jwt.sign(
    payload,
    secret,
    {
      algorithm: "HS256",
    },
    { expiresIn: "1h" }
  );
}

export function validateToken(token) {
  try {
    const decoded = jwt.verify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
}

export function decodeToken() {
  const token = getToken();
  return jwt.decode(token);
}
