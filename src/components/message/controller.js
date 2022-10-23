import { PrismaClient } from "@prisma/client";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: "1481293",
  key: "67479aa6e2e3a1fa10f5",
  secret: "5f2e43b42d4f3846f608",
  cluster: "us2",
  useTLS: true
});


// Codigo
const prisma = new PrismaClient()

export const findAll = async (req, res) => {
    const sender_id = Number(req.params.sender_id);
    const id = Number(req.params.id);
    
    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              AND: [{ sender_id }, { user_id :id }],
            },
            {
              AND: [{ sender_id: id }, { user_id: sender_id }],
            },
          ],
        },
        include: {
          User: true,
        },
      });
    
      res.json({
        ok: true,
        data: messages,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        data: error.message,
      });
    }
   };
    
   export const store = async (req, res) => {
    try {
      const { body } = req;
   
      const message = await prisma.message.create({
        data: { ...body },
      });
     
      const newMessage = await prisma.message.findFirst({
        where: { id: message.id },
        include: {
          User: true,
        },
      });
   
      pusher.trigger("my-chat", `new-message-${body.user_id}-${body.sender_id}`, {
        message: newMessage,
      });
   
      res.status(201).json({
        ok: true,
        data: message,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        data: error.message,
      });
    }
   };
   
   