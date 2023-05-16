import express from "express"
import cors from "cors"
import {StreamChat} from "stream-chat";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";

const app = express()

app.use(cors());
app.use(express.json());
const api_key ="z86yhp59u5se";
const api_secret ="re9dju2w5njubrpudwra98e3rbja9f72bnnsad5upc3n52yd4eye9jfp3ta86wna";
const serverClient = StreamChat.getInstance(api_key,api_secret);


app.get('/', (req, res) => {
    res.send('Hello from API home page')
})

app.post("/signup" ,async (req,res)=>{
    try{
    const{firstName,lastName,userName,password}=req.body
    const userId= uuidv4();
    const hashedPassword = await bcrypt.hash(password,10);
    const token =serverClient.createToken(userId);
    res.json({token,userId,firstName,lastName,userName,hashedPassword})
    } catch (error) {
        res.json(error);
    }


});
app.post("/login",async(req,res)=>{
try{
const {username,password}= req.body
const {users} = await serverClient.queryUsers({name:username});
if(users.length === 0) return res.json({message:"user not found"});

const passwordMatch= await bcrypt.compare(password,users[0].hashedPassword);

const token = serverClient.createToken(users[0].id);
if (passwordMatch){
    res.json({
        token,
        firstName:users[0],firstName,
        lastName:users[0],lastName,
        username,
        userId:users[0],userId,
    });
}
}catch(error){
    res.json(error);
}


});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});