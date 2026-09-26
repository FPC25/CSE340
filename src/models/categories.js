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

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO project_category (project_id, category_id)
        VALUES ($1, $2);
    ` 

    await db.query(query, [projectId, categoryId])
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

const createCategory = async (categoryName) => {
    const query = `
        INSERT INTO category (category_name)
        VALUES ($1)
        RETURNING category_id;
    `

    const result = await db.query(query, [categoryName]);
    return result.rows[0].category_id
}

export { 
    getAllCategories, 
    getCategoryDetails, 
    getCategoriesByProjectsId,
    updateCategoryAssignments,
    createCategory
};