module.exports = errorHandler;

function errorHandler(error, req, res, next) {
    if (typeof (error) === 'string') {
        return res.status(400).json({ message: err });
    }

    if (error.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid Token' });
    }
    
    return res.status(500).json({ message: error.message });
}