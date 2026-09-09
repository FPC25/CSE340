import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT 
            p.organization_id, 
            p.title, 
            p.description, 
            p.location, 
            TO_CHAR(p.date, 'YYYY-MM-DD') AS date, 
            o.orgname
        FROM project p
        JOIN organization o ON o.organization_id = p.organization_id
        Order by date ASC; 
    `;

    const result = await db.query(query);

    return result.rows;
}

export { getAllProjects } 