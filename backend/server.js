require("dotenv").config();

const config=require("./config.json")
const mongoose=require("mongoose")

mongoose.connect(config.connectionString)

const User=require("./models/user.mode"); 



const express=require("express");

const cors =require("cors")

const app=express();

const jwt=require("jsonwebtoken")
const {authenticateToken} =require("./utilities")

app.use(express.json());

app.use(
    cors({
        origin:"*"
    })
)

app.get("/",(req,res)=>{
    res.json({data:"czesc"})
})


//konto
app.post("/utworz-konto",async (req,res)=>{
    const {fullName,email,password}=req.body

    if(!fullName){
        return res.status(400)
        .json({error:true,message:"Pełne imię jest potrzebne"})
    }

    if(!email){
        return res.status(400)
        .json({error:true,message:"Email wymagany"})
    }

    if(!password){
        return res.status(400)
        .json({error:true,message:"Hasło wymagane"})
    }

    const isUser=await User.findone({email:email});

    if(isUser){
        return res.json({
            error:true,
            message:"Użytkownik już istnieje"
        })
    }

    const user = new User({
        fullName,
        email,
        password,
    })

    await user.save()

    const accessToken=jwt.sign({user},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"36000m"
    })

    return res.json({
        error:false,
        user,
        accessToken,
        message:"Rejestracja się powiodła"
    })
})

app.listen(8000);

module.exports=app