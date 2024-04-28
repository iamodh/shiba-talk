import db from "@/lib/db";
import { withApiSession } from "@/lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;
    if (!user?.id) {
      return res.status(401).end();
    }
    const foundUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!foundUser) {
      return res.status(404).end();
    }
    return res.json({ ...foundUser });
  }
  return res.status(405).end();
}

export default withApiSession(handler);
