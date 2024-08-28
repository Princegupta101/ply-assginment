import { ObjectId } from 'mongodb';

import { connect } from "@/app/dbConfig/dbConfig";
import Products from '@/app/models/ProductModel';
import ReviewProduct from "@/app/models/ReviewProductModel";
import User from "@/app/models/userModel";

// Middleware to check if user is authenticated
const isAuthenticated = (handler) => async (req, res) => {
    // Implement your authentication logic here
    // For example, check for a valid session or JWT token
    // If not authenticated, return a 401 status
    // If authenticated, call the handler
    return handler(req, res);
};

const validateProductData = (data) => {
    const requiredFields = ['productName', 'price', 'image', 'productDescription', 'department'];
    for (let field of requiredFields) {
        if (!data[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
    if (isNaN(parseFloat(data.price)) || parseFloat(data.price) < 0) {
        throw new Error('Price must be a non-negative number');
    }
};

export const PUT = isAuthenticated(async (req, res) => {
    await connect();
    
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ error: 'Product ID is required' }), { status: 400 });
    }

    try {
        validateProductData(body);

        const newProduct = {
            productName: body.productName,
            price: parseFloat(body.price),
            image: body.image,
            productDescription: body.productDescription,
            department: body.department,
        };

        const product = await Products.findByIdAndUpdate(
            new ObjectId(id),
            newProduct,
            { new: true, runValidators: true }
        );

        if (!product) {
            return new Response(JSON.stringify({ error: 'No product found with the given ID' }), { status: 404 });
        }

        return new Response(JSON.stringify(product), { status: 200 });

    } catch (err) {
        console.error('Error updating product:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }
});

export const POST = isAuthenticated(async (req, res) => {
    await connect();
    
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const user_id = searchParams.get('user_id');

    if (!id || !user_id) {
        return new Response(JSON.stringify({ error: 'Product ID and User ID are required' }), { status: 400 });
    }

    try {
        validateProductData(body);

        const user = await User.findById(user_id);

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        const newProduct = new ReviewProduct({
            originalId: id,
            user_id: user_id,
            productName: body.productName,
            price: parseFloat(body.price),
            image: body.image,
            productDescription: body.productDescription,
            department: body.department,
            status: "pending",
        });

        const product = await newProduct.save();

        if (product) {
            user.reviewProduct.push(product._id);
            await user.save();
            await product.populate(['originalId', 'user_id']);
 
            return new Response(JSON.stringify(product), { status: 200 });
        }

    } catch (err) {
        console.error('Error creating review product:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }
});