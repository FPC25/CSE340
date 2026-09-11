import db from './db.js'

const getAllCategories = async() => {
    try {
        const query = `
            SELECT 
                category_id,
                category_name
            FROM category
            ORDER BY category_name ASC;
        `;

        const result = await db.query(query);

        return result.rows;
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export { getAllCategories } 