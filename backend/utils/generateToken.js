import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../config/envVars.js';

export const generateTokenAndSetCookie = (userid, res) => { 
    const token = jwt.sign({userid}, ENV_VARS.JWT_SECRET, {expiresIn: "15d"});
    res.cookie("jwt-netflix", token, {maxAge : 15 * 24 * 60 * 60 * 100,
    httpOnly: true,
    sameSite : "strict",
    secure: ENV_VARS.NODE_ENV !== "development"
});

return token;
    
}