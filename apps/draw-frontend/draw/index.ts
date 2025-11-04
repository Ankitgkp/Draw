import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number
} | {
    type: "circle";
    centerX: number;
    center: number;
    radius: number;


}


export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {

    const ctx = canvas.getContext("2d");

    let existingShapes: Shape[] = await getExistingShapes(roomId);

    if (!ctx) {
        return;
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'chat') {
            try {
                const parsedMessage = JSON.parse(message.message);
                const shape = parsedMessage.shape;
                if (shape) {
                    console.log('Received shape from WebSocket:', shape);
                    existingShapes.push(shape);
                    clearCanvas(existingShapes, canvas, ctx);
                }
            } catch (e) {
                console.error('Failed to parse incoming message:', e);
            }
        }
    }

    // ctx.fillStyle = "rgba(0, 0, 0)";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    clearCanvas(existingShapes, canvas, ctx);
    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        const shape: Shape = {
            type: "rect",
            x: startX,
            y: startY,
            height,
            width
        }
        existingShapes.push(shape)

        socket.send(JSON.stringify({
            type: 'chat',
            message: JSON.stringify({
                shape
            }),
            roomId
        }))
    });

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.strokeRect(startX, startY, width, height);
        }
    });
}



function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    existingShapes.map((shape) => {
        if (shape.type === 'rect') {
            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}


async function getExistingShapes(roomId: string) {
    try {
        const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
        const messages = response.data.messages;

        const shapes = messages
            .filter((x: { message: string }) => x.message && x.message !== 'undefined')
            .map((x: { message: string }) => {
                try {
                    const messageData = JSON.parse(x.message);
                    return messageData.shape || messageData;
                } catch (e) {
                    console.error('Failed to parse message:', x.message, e);
                    return null;
                }
            })
            .filter((shape: any) => shape !== null);

        return shapes;
    } catch (e) {
        console.error('Failed to fetch existing shapes:', e);
        return [];
    }
}