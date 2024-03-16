import JWT from 'jsonwebtoken';

let jwtAuth = (req, res, next) => {

    // If cookies exist and token exist inside cookies then assign it to `token` ... Else null
    let token = (req.cookies && req.cookies.token) || null;
    // Checking if token exists
    if(!token){
        return res.status(400).json({
            success: false,
            message: "Not authorized"
        })
    }
    
    // Remember token's format and it's 3 fields. But we need only userId
    // Hence we are first extracting Payload from entire token. And since we used `SECRET` key from .env file, 
    // we need it here too for decrypting
    try {
       let payload = JWT.verify(token, process.env.SECRET); 
        req.user = {id: payload.id, username: payload.username}; // --> We are setting requesting data which will be needed after middleware, 
        // i.e in `/getUser` controller 
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Not authorized" 
        })
    }

    next();
}

export default jwtAuth;