import { connect } from "@/app/dbConfig/dbConfig";
import Products from '@/app/models/ProductModel';

export async function GET(req) {
    await connect(); 
    
    try {
        const products = await Products.find();

        if (!products.length) {
            return new Response(
                JSON.stringify({ error: 'No products found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify(products),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
