const jwt = require("jsonwebtoken");
const SECRETKEY = "SECr3t11";

const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, SECRETKEY, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
  
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(403).json({ message: "Invalid Authorization" });
    }
};

module.exports = {
    authenticateJwt,
    SECRETKEY
}

