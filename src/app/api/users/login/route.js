import bcryptjs from 'bcryptjs'; // Correct import
import jwt from 'jsonwebtoken';

import { connect } from "@/app/dbConfig/dbConfig"; // Correct function name
import User from "@/app/models/userModel";

// POST function for user login
export async function POST(req, res) {
  await connect(); // Ensure correct database connection function

  const reqBody = await req.json();
  const { username, password } = reqBody;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 400 });
    }

    // Compare passwords
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: 'Incorrect password' }), { status: 400 });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send response with token and user info
    return new Response(JSON.stringify({ token, role: user.role, userId: user._id }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
