import db from "@/lib/db";
import { withApiSession } from "@/lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { id },
    } = req;
    if (id) {
      const post = await db.post.findUnique({
        where: {
          id: +id?.toString(),
        },
        include: {
          user: true,
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });
      return res.json({ post });
    }
  }

  return res.status(405).end();
}

export default withApiSession(handler);
