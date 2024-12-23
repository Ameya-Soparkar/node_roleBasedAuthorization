const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const register = async (req, res) => {
    try {
        const { username, password, role } = req.body  
        console.log(username)
        console.log(password)
        console.log(role)
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword);
        const newUser = new User({username, password: hashedPassword, role})
        console.log("saving user");
        
        await newUser.save()
        res.status(201).json({message : `user registered ${username}`})    
    } catch (error) {
        res.status(500).json({message : error.message})
    }
    
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        
        if(!user){
            return res.status(404).json({message : `user name ${username} not found` })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(404).json({message : "password is incorrect"})
        }

        const token = jwt.sign({id:user._id, role: user.role},
                                process.env.JWT_SECRET, 
                            { expiresIn: "1h" })

        res.status(200).json({ token })

    } catch (error) {
        return res.status(401).json({message : "token wrong"})
    }
    
}

module.exports = {register, login}