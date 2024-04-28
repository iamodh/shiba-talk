import db from "@/lib/db";
import { withApiSession } from "@/lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const posts = await db.post.findMany({
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
    return res.json({ posts });
  }
  if (req.method === "POST") {
    const {
      body: { title, img },
      session: { user },
    } = req;
    const newPost = await db.post.create({
      data: {
        title,
        img,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    return res.status(201).json({ newPost });
  }
  return res.status(405).end();
}

export default withApiSession(handler);
