import { JWT_SECRET } from "../config";
import Jwt from "jsonwebtoken";

class JwtService {
  static sign(payload, expiry = "60s", secret = JWT_SECRET) {
    return Jwt.sign(payload, secret, { expiresIn: expiry });
  }

  static verify(token, secret = JWT_SECRET) {
    return Jwt.verify(token, secret);
  }
}

export default JwtService;
