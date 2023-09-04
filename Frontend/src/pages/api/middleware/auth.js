// api/middleware/auth.js
import nextConnect from "next-connect";
import { validateToken } from "../utils/auth";

const authMiddleware = nextConnect();

authMiddleware.use((req, res, next) => {
  const token = req.cookies.token || null;
  if (!validateToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
});

export default authMiddleware;
