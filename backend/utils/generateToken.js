import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  // Sign a token that expires in 30 days (you can adjust)
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "defaultsecret", {
    expiresIn: "30d",
  });
};

export default generateToken;
