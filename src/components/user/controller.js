import { PrismaClient } from "@prisma/client";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: "1481293",
  key: "67479aa6e2e3a1fa10f5",
  secret: "5f2e43b42d4f3846f608",
  cluster: "us2",
  useTLS: true
});

pusher.trigger("my-channel", "my-event", {
  message: "hello world"
});

// Codigo
const prisma = new PrismaClient()

export const findAll = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { id: { not: Number(req.params.id) } }
        })

        res.json({
            ok: true,
            data: users,
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            data: error.message,
        })
    }
}

export const findOne = async (email) => {
    try {
        return await prisma.user.findFirst({
            where: {email}
        })

    } catch (error) {
        return null
    }
}

export const store = async (req, res) => {
    try {
        const { body } = req
        const userByEmail =  await findOne(body.email)
        if (userByEmail) {
            return res.json({
                ok: true,
                data: userByEmail,
            })
        }

        body.profile_url = `https://avatars.dicebear.com/api/avataaars/${body.name}.svg`

        const user = await prisma.user.create({
            data: {
                ...body
            }
        })
        
        pusher.trigger("my-chat", "my-list-contacts", {
            message: "Call to update list contacs"
        });

        res.status(201).json({
            ok:true,
            data: user
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            data: error.message
        })
    }
}