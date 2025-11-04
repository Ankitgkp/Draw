import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { PrismaClient } from '@repo/db/client'

const prismaClient = new PrismaClient();
const PORT = proces.env.PORT ? parseInt(process.env.PORT) : 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server starting on port ${PORT}`);

interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string
};

const users: User[] = [];




function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded == "string") {
            return null;
        }
        if (!decoded || !decoded.userId) {
            return null;
        }
        return decoded.userId;
    } catch (e) {
        return null;
    }

}

wss.on('connection', function connection(ws, request) {


    const url = request.url;

    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);

    if (userId == null) {
        ws.close();
        return null;
    }


    users.push({
        userId,
        rooms: [],
        ws
    })


    ws.on('message', async function message(data) {
        let parsedData;
        if (typeof data != "string") {
            parsedData = JSON.parse(data.toString());
        } else {
            parsedData = JSON.parse(data);
        }

        if (parsedData.type === "join_room") {
            const user = users.find(x => x.ws === ws);
            if (user) {
                user.rooms.push(parsedData.roomId);
                console.log(`User ${user.userId} joined room ${parsedData.roomId}. Total users in system: ${users.length}`);
            }
        }

        if (parsedData.type === "leave_room") {
            const user = users.find(x => x.ws === ws);
            if (!user) {
                return;
            }
            user.rooms = user.rooms.filter(x => x !== parsedData.roomId)
        }

        if (parsedData.type === "chat") {
            const roomIdOrSlug = parsedData.roomId;
            const message = parsedData.message;

            if (!roomIdOrSlug) {
                console.error('No roomId provided in chat message:', parsedData);
                return;
            }

            // Try to parse as number to check if it's an ID
            const numericId = parseInt(roomIdOrSlug);

            // Find the room by ID (if numeric) or slug (if string)
            let room;
            if (!isNaN(numericId)) {
                // It's a number, look up by ID
                room = await prismaClient.room.findUnique({
                    where: { id: numericId }
                });
            } else {
                // It's a string slug, look up by slug
                room = await prismaClient.room.findUnique({
                    where: { slug: roomIdOrSlug }
                });
            }

            if (!room) {
                console.error(`Room not found for id/slug: ${roomIdOrSlug}`);
                return;
            }

            console.log(`Broadcasting to room ${roomIdOrSlug}. Users in system: ${users.length}`);
            
            let broadcastCount = 0;
            users.forEach(user => {
                console.log(`User ${user.userId} rooms:`, user.rooms, `Checking for: ${roomIdOrSlug}`);
                if (user.rooms.includes(roomIdOrSlug)) {
                    broadcastCount++;
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId: roomIdOrSlug
                    }))
                }
            });
            
            console.log(`Broadcasted message to ${broadcastCount} users in room ${roomIdOrSlug}`);

            await prismaClient.chat.create({
                data: {
                    roomId: room.id,
                    message,
                    userId
                }
            })

            console.log('Chat saved to database:', { roomId: room.id, userId, messageLength: message.length });
        }

    })

});