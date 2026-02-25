const jwt = require("jsonwebtoken");

const secret_key = 'b2Vfb3ZlcnRoZXJlX29yX3NvbWV0aGluZ19lbHNld2hlcmU';

function auth(req, res, next) {
    try {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).send({
                success: false,
                message: "Token missing"
            });
        }

        const token = header.split(" ")[1];

        const decoded = jwt.verify(token, secret_key);

        req.user = decoded;
        next();

    } catch (err) {
        return res.status(401).send({
            success: false,
            message: "Invalid token"
        });
    }
}

module.exports = auth;
