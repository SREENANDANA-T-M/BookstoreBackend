const jwt = require("jsonwebtoken")
const adminjwtMiddleware=((req,res,next)=>{
    console.log(`Inside JWT Middleware`);
    const token=req.headers.authorization.split(" ")[1]
    console.log("Token:",token);
    try {
        const jwtResponse= jwt.verify(token,process.env.jwtSecretKey)
        console.log("JWT Response:",jwtResponse);
        req.payload=jwtResponse.userMail
        req.role=jwtResponse.role
        if(jwtResponse.role=="Admin"){
         next();
        }else{
            res.status(401).json(`Unauthorized Request`)
        }
        
    } catch (error) {
        res.status(401).json(`Invalid Token`,error)
    }
    
});
module.exports=adminjwtMiddleware
