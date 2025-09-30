
exports.processPayment = (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: "Amount is required" });
  res.json({ message: `Payment of ${amount} processed successfully` });
};
