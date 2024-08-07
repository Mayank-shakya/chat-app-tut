import user from "../Models/usermodel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { errorHandler } from "../utils/error.js"

export const signup = async (req, res, next) => {
    try {
        const {username, email, password, confirmPassword, gender} = req.body

        let validUser = await user.findOne({ email })
        console.log('.....1');
        if (validUser) {
            return next(errorHandler(400,"user already exist"))
        }

        if (password !== confirmPassword) {
            return next(errorHandler(400,"password don't match"))
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
        console.log('.....');
        const newuser = await user.create({
            username,
            email,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        })
        console.log(newuser);


        //generate jwt token
        const token = jwt.sign({id:newuser._id}, process.env.JWTSECRET)

        res.cookie("token", token, {httpOnly : true})

        res.status(201).json({
            _id: newuser._id,
            username: newuser.username,
            email: newuser.email,
            profilePic: newuser.profilePic,
        })


    } catch(err){
        console.log("hjbeddhb");
        next(err);
    }
}

export const login = async(req, res, next) => {
    try{
        const {email, password} = req.body;

        const validUser = await user.findOne({email})
        if(!validUser){
            next(errorHandler(400, "user not found"))
        }

        const validPassword = await bcrypt.compare(password, validUser.password);

        if(!validPassword){
            next(errorHandler(400, "email or passwor is inncorrect"))
        }

        const token = jwt.sign({id: validUser._id}, process.env.JWTSECRET)
        res.cookie("token", token, {httpOnly: true})

        

    }catch(err){
        next(err);
    }
}

//export const logout = (req, res) => { }
//     import user from "../Models/usermodel.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { errorHandler } from "../utils/error.js";

// export const signup = async (req, res, next) => {
//     try {
//         const { username, email, password, confirmPassword, gender } = req.body;

//         // Check if user already exists
//         let validUser = await user.findOne({ email });
//         if (validUser) {
//             return next(errorHandler(400, "User already exists"));
//         }

//         // Check if passwords match
//         if (password !== confirmPassword) {
//             return next(errorHandler(400, "Passwords don't match"));
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
//         const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

//         // Create new user
//         const newuser = await user.create({
//             username,
//             email,
//             password: hashedPassword,
//             gender,
//             profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
//         });

//         // Generate JWT token
//         const token = jwt.sign({ id: newuser._id }, process.env.JWTSECRET, { expiresIn: '1h' });

//         // Set the token in a cookie
//         res.cookie("token", token, { httpOnly: true });

//         // Send response
//         res.status(201).json({
//             _id: newuser._id,
//             username: newuser.username,
//             email: newuser.email,
//             profilePic: newuser.profilePic,
//         });

//     } catch (err) {
//         next(err);
//     }
// }

// export const login = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         // Find user
//         const validUser = await user.findOne({ email });
//         if (!validUser) {
//             return next(errorHandler(400, "User not found"));
//         }

//         // Check password
//         const validPassword = await bcrypt.compare(password, validUser.password);
//         if (!validPassword) {
//             return next(errorHandler(400, "Email or password is incorrect"));
//         }

//         // Generate JWT token
//         const token = jwt.sign({ id: validUser._id }, process.env.JWTSECRET, { expiresIn: '1h' });
//         res.cookie("token", token, { httpOnly: true });

//         // Send response
//         res.status(200).json({
//             _id: validUser._id,
//             username: validUser.username,
//             email: validUser.email,
//             profilePic: validUser.profilePic,
//         });

//     } catch (err) {
//         next(err);
//     }
// }

export const logout = (req, res) => {
    // Clear the token cookie
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Logged out successfully" });
}
