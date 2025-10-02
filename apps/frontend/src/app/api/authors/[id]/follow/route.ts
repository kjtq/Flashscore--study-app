import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (req.method === "POST") {
    try {
      // Call your backend API directly
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://flashstudy-ri0g.onrender.com";
      
      const response = await fetch(`${backendUrl}/api/authors/${id}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include auth token if needed
          ...(req.headers.authorization && {
            "Authorization": req.headers.authorization
          })
        },
        // Include any body data if needed
        body: JSON.stringify({
          // Add any necessary data
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json(error);
      }

      const result = await response.json();
      res.status(200).json(result);
      
    } catch (error) {
      console.error("Error following author:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to follow author" 
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}