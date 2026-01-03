import z from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (!z.email().safeParse(email).success) {
      return res.send({ success: false, message: "Invalid email" });
    }

    const token = jwt.sign({ name, email }, "secret", {
      expiresIn: "1d",
    });

    //hash pwd
    const hashedPassword = await bcrypt.hash(password, 10);

    // Temporary response (DB comes later)
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        name,
        email,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
