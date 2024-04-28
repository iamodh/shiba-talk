import db from "@/lib/db";
import { withApiSession } from "@/lib/withSession";
import { connect } from "http2";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      query: { id },
      session: { user },
    } = req;

    if (id) {
      const alreadyExists = await db.like.findFirst({
        where: {
          userId: user?.id,
          postId: +id.toString(),
        },
        select: {
          id: true,
        },
      });
      if (alreadyExists) {
        await db.like.delete({
          where: {
            id: alreadyExists.id,
          },
        });
      } else {
        await db.like.create({
          data: {
            user: {
              connect: {
                id: user?.id,
              },
            },
            post: {
              connect: {
                id: +id.toString(),
              },
            },
          },
        });
      }
    }
    return res.status(201).end();
  }
  return res.status(405).end();
}

export default withApiSession(handler);
