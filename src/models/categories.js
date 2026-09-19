import db from './db.js';

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
};

const getCategoryDetails = async (categoryId) => {
    try {
        const query = `
            SELECT
                category_id,
                category_name
            FROM category
            WHERE category_id = $1;
        `;
        const result = await db.query(query, [categoryId]);

        return result.rows[0];
    }
    catch (error) {
        console.error('Error fetching category details:', error);
        throw error;
    }
}

const getCategoriesByProjectsId = async (projectId) => {
    try {
        const query = `
            SELECT 
                c.category_id,
                c.category_name
            FROM category c
            JOIN project_category pc ON pc.category_id = c.category_id
            JOIN project p ON p.project_id = pc.project_id
            WHERE pc.project_id = $1;
        `;

        const result = await db.query(query, [projectId]);

        return result.rows;
    }
    catch (error) {
        console.error('Error fetching category by project ID:', error);
        throw error;
    }
}

export { getAllCategories, getCategoryDetails, getCategoriesByProjectsId };