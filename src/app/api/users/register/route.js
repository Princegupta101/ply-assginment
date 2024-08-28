import bcrypt from 'bcryptjs'; // Correct import
import jwt from 'jsonwebtoken';

import { connect } from "@/app/dbConfig/dbConfig"; // Correct function name
import User from "@/app/models/userModel";

// POST function for user registration
export async function POST(req, res) {
  await connect(); // Ensure correct database connection function

  const { username, password, role } = await req.json();

  try {
    // Check if user already exists
    const user = await User.findOne({ username });
    if (user) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      reviewProduct: []
    });

    await newUser.save();

    return new Response(JSON.stringify({ message: "User Registered Successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
