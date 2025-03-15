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

const OLLAMA_URL = "http://localhost:11434";

app.use(express.json());

app.use(
    cors({
        origin:"*"
    })
)

app.get("/",(req,res)=>{
    res.json({data:"czesc"})
})


app.post("/chat", async (req, res) => {
    try {
      const { message, model = "deepseek-r1:8b" } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Wiadomosc jest wymagana" });
      }
  
      // Sprawdzamy, czy użytkownik prosi o notatkę
      const isNoteRequest = message.toLowerCase().includes("notatka") || 
                            message.toLowerCase().includes("notatkę") ||
                            message.toLowerCase().includes("notatki");
      
      // Instrukcja systemowa zależna od rodzaju zapytania
      let systemInstruction = "Odpowiadaj tylko w języku polskim.";
      if (isNoteRequest) {
        systemInstruction += " Przygotuj odpowiedź w formacie Markdown.";
      }
      
      const fullPrompt = `${systemInstruction}\n\nUżytkownik: ${message}`;
      
      const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt: fullPrompt,
          stream: false,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Ollama blad odpowiedzi: ", errorText);
        throw new Error(`Ollama blad: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      // Usuwamy tekst pomiędzy znacznikami <think>
      let cleanedResponse = data.response;
      cleanedResponse = cleanedResponse.replace(/<think>[\s\S]*?<\/think>/g, "");
      
      res.json({ response: cleanedResponse });
    } catch (error) {
      console.error("Detailed chat error: ", error);
      res.status(500).json({
        error: "Failed to get response from Ollama",
        details: error.message,
      });
    }
  });


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
        expiresIn: "3600000",
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



app.get("/get-note/:id", authenticateToken, async (req, res) => {
    try {
        const noteId = req.params.id;
        const { user } = req.user; // Extract user from req.user
        
        const note = await Note.findById(noteId);
        
        if (!note) {
          return res.status(404).json({ error: true, message: 'Notatka nie została znaleziona' });
        }
        
      
        if (note.userId.toString() !== user._id.toString()) {
          return res.status(403).json({ error: true, message: 'Brak dostępu do tej notatki' });
        }
        
        return res.json({ note });
      } catch (error) {
        console.error('Error fetching note:', error);
        return res.status(500).json({ error: true, message: 'Wystąpił błąd podczas pobierania notatki' });
      }
});


app.get("/search-notes", authenticateToken, async (req, res) => {
    try {
        const { user } = req.user;
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ 
                error: true, 
                message: "Wyszukiwana fraza jest wymagana" 
            });
        }

        // Szukaj w tytule, treści i tagach
        const notes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: q, $options: "i" } },
                { content: { $regex: q, $options: "i" } },
                { tags: { $regex: q, $options: "i" } }
            ]
        }).sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: `Znaleziono ${notes.length} notatek dla frazy "${q}"`
        });

    } catch (error) {
        console.error("Błąd wyszukiwania:", error);
        return res.status(500).json({ 
            error: true, 
            message: "Błąd serwera podczas wyszukiwania" 
        });
    }
});

app.listen(8000);

module.exports=app