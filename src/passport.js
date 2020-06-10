import { Strategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { prisma } from "../generated/prisma-client";
import dotenv from "dotenv";
import path from "path";
import "./env";

console.log(process.env.JWT_SECRET);
dotenv.config({ path: path.resolve(__dirname, ".env") });

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

const verifyUser = async (payload, done) => {
  const user = await prisma.user({ id: payload.id });
  try {
    if (user != null) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
};

export const authenticateJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (user) {
      req.user = user;
      return user;
    }
    next();
  })(req, res, next);
};

passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();