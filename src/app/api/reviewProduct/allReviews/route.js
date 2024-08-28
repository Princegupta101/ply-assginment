import { connect } from "@/app/dbConfig/dbConfig";
import ReviewProduct from "@/app/models/ReviewProductModel";

export async function GET(req) {
    await connect(); 
    
    try {
        const products = await ReviewProduct.find();

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
        console.log(err);
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
