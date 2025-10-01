
import { NextApiRequest, NextApiResponse } from 'next';

const AuthorController = require('@s/authorController');
const authorController = new AuthorController();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const result = authorController.followAuthor(id as string);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error following author:', error);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
