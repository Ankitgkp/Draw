import express from 'express';
const app = express();
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from './middleware';
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from '@repo/common/types';
import prismaClient from '@repo/db/client';
import cors from 'cors';
app.use(express.json());
app.use(cors());
app.post('/signup', async (req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Incorrect Inputs",
            details: parsedData.error.issues
        })
        return;
    }
    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                password: parsedData.data?.password,
                name: parsedData.data.name
            }
        })

        res.json({
            userId: user.id
        })
    } catch (e) {
        res.status(409).json({
            message: "User already exists with this email"
        })
    }


})



app.post('/signin', async (req, res) => {

    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Incorrect Inputs",
            details: parsedData.error.issues
        })
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    })

    if (!user) {
        res.status(401).json({
            message: "Invalid email or password"
        })
        return;
    }

    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    })
})


app.post('/room', middleware, async (req, res) => {

    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect Inputs"
        })
        return;
    }
    //@ts-ignore
    const userId = req.userId;

    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })

        res.json({
            roomId: room.id
        })
    } catch (e) {
        res.status(411).json({
            message: "room already exists"
        })

    }

})


app.get('/chats/:roomId', async (req, res)=>{
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where:{
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50 
    })
    res.json({
        messages
    })
})






const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`HTTP backend listening on port ${PORT}`);
});
