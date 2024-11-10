import jwt from 'jsonwebtoken'

const authuser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token, authorization denied' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.body.userId = decoded.Id
        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: 'Token is not valid' });

    }
}

export default authuser;