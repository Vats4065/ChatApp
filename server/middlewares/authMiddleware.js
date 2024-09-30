const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    try {

        const authHeader = req.header('Authorization');



        if (!authHeader) {
            return res.status(401).json({ error: 'Access denied, no token provided' });
        }


        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Invalid token format' });
        }


        const token = authHeader.replace('Bearer ', '');


        const decoded = jwt.verify(token, "secret-key");


        req.user = decoded;

        next();
    } catch (err) {
        console.error('Error verifying token:', err);


        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }


        return res.status(400).json({ error: 'Authentication failed' });
    }
};
