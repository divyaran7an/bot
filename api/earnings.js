module.exports = (req, res) => {
  const { hash } = req.query;
  res.status(200).json({ message: '110' });
};