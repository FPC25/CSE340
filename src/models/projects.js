import db from './db.js'

const getAllProjects = async() => {
    try {
        const query = `
            SELECT 
                p.organization_id, 
                p.title, 
                p.description, 
                p.location, 
                TO_CHAR(p.date, 'DD/MM/YYYY') AS date, 
                o.orgname
            FROM project p
            JOIN organization o ON o.organization_id = p.organization_id
            Order by date ASC; 
        `;

        const result = await db.query(query);

        return result.rows;
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
}

export { getAllProjects } 