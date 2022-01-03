const router = require("express").Router();
const User = require("../Models/User");

var bcrypt = require("bcryptjs");
//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    req.body.password = hashedPassword;

    const user = await User.create(req.body);

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ err });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(err);
  }
});

module.exports = router;
