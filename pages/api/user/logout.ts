import db from "@/lib/db";
import { withApiSession } from "@/lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    req.session.destroy();
    return res.status(200).end();
  }
  return res.status(405).end();
}

export default withApiSession(handler);
