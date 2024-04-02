module.exports = (req, res) => {
  const { hash } = req.query;

  if (hash === '#capx-test-key') {
    res.status(200).json({
      message: 'Login successful',
      user: {
        name: 'Vaibhav',
        walletAddress: '0x6F10607507afF450b8Cf0A6fa2641a781889DdfE',
        points: 110
      }
    });
  } else {
    res.status(401).json({ message: 'Login failed' });
  }
};