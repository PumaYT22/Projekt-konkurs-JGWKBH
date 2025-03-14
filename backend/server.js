require("dotenv").config();

const config=require("./config.json")
const mongoose=require("mongoose")

mongoose.connect(config.connectionString)

const User=require("./models/user.mode"); 
const Note=require("./models/note.model")


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

    const isUser=await User.findOne({email:email});

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

//login
app.post("/login",async (req,res)=>{
    const{email,password}=req.body

    if(!email){
        return res.status(400).json({message:"Email jest potrzebny"});
    }
    if(!password){
        return res.status(400).json({message:"Hasło jest potrzebne"});
    }

    const userInfo=await User.findOne({email:email});

    if(!userInfo){
        return res.status(400).json({message:"Nie znaleziono użytkownika"})
    }

    if (userInfo.email===email && userInfo.password===password) { 
        const user = {user: userInfo};
        const accessToken=jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000",
        });

        return res.json({
            error: false,
            message: "Logowanie Udane",
            email,
            accessToken,
        });
        } else{
        return res.status(400).json({
        error: true,
        message: "Niepoprawne dane", });
    }


})

//Dostan uzytkownika
app.get("/get-user",authenticateToken,async (req,res)=>{
    const {user} = req.user;

    const isUser=await User.findOne({_id:user._id})

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user:{fullName:isUser.fullName,email:isUser.email,"_id":isUser._id,
            createdOn:isUser.createdOn,
        },
        message:"",
    })
})

//Dodawania
app.post("/add-note",authenticateToken,async (req,res)=>{
    const {title, content, tags, isPinned } = req.body;
    const {user} = req.user;
    
    if (!title) {
        return res.status(400).json({ error: true, message: "Tytuł jest wymagany" });
    }
    if(!content){
        return res.status(400).json({error:true,
            message:"Zawartość wymagana"
        })
    }

    try{
        const note=new Note({
            title,
            content,
            tags:tags || [],
            userId:user._id
        });

        await note.save()

        return res.json({
            error:false,
            note,
            message:"Notatka dodana!"
        })

    }catch(error){
        return res.status(500).json({error:true,
            message:"Server Error"
        })
    }

})

//edytka
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => { 
    const noteId = req.params.noteId;
    const {title, content, tags, isPinned } = req.body;
    const {user} = req.user;

    if (!title && ! content && !tags){
        return res
        .status(400)
        .json({ error: true, message: "Brak zmian wprowadzono" });
    }

    try {
        const note = await Note.findOne({
            _id: noteId,
            userId: user._id
        });
    
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Nie znaleziono notatki"
            });
        }
    
        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;
    
        await note.save();
    
        return res.json({
            error: false,
            note,
            message: "Notatka została zmieniona!"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "server error",
        });
    }
})

//wszystkienotatki
app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: "Wszystkie notatki wybrano",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server Error",
        });
    }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOne({
            _id: noteId,
            userId: user._id
        });

        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Nie znaleziono notatek"
            });
        }

        await Note.deleteOne({
            _id: noteId,
            userId: user._id
        });

        return res.json({
            error: false,
            message: "Usunięto notatke",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server Error",
        });
    }
});

app.put('/update-note-pinned/:noteId',authenticateToken,async (req,res)=>{
    const noteId = req.params.noteId;
    const {isPinned } = req.body;
    const {user} = req.user;

    try {
        const note = await Note.findOne({
            _id: noteId,
            userId: user._id
        });
    
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Nie znaleziono notatki"
            });
        }
    
      
        note.isPinned = isPinned;
    
        await note.save();
    
        return res.json({
            error: false,
            note,
            message: "Notatka została zmieniona!"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "server error",
        });
    }
})


app.get("/search-notes", authenticateToken, async (req, res) => {
    try {
        const user = req.user; // Pobierz cały obiekt użytkownika
        const { query } = req.query; // Zmiana z req.body na req.query

        if (!query) {
            return res.status(400).json({ 
                error: true, 
                message: "Potrzeba wpisania!" 
            });
        }

        const matchingNotes = await Note.find({
            userId: user._id, // Załóżmy, że user zawiera pole _id
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Sukces",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

app.listen(8000);

module.exports=app