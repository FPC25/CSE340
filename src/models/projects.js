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
};

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    try {
        const query = `
            SELECT
                p.project_id,
                p.organization_id, 
                p.title, 
                p.description, 
                p.location, 
                TO_CHAR(p.date, 'DD/MM/YYYY') AS date, 
                o.orgname
            FROM project p
            JOIN organization o ON o.organization_id = p.organization_id
            WHERE p.date >= CURRENT_DATE
            ORDER BY p.date ASC
            LIMIT $1;
        `;

        const result = await db.query(query, [number_of_projects]);

        return result.rows;
    }
    catch (error) {
        console.error('Error fetching upcoming projects:', error);
        throw error;
    }
};

const getProjectDetails = async (projectId) => {
    const query = `
      SELECT
        p.project_id,
        p.organization_id,
        p.title,    
        p.description,
        p.location,
        TO_CHAR(p.date, 'DD/MM/YYYY') AS date,
        o.orgname
      FROM project p
      JOIN organization o ON o.organization_id = p.organization_id  
      WHERE p.project_id = $1
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows[0] // Return the first (and only) row
};

const getProjectsByCategoryId = async (categoryId) => {
    try {
        const query = `
            SELECT
                p.project_id,
                p.organization_id,
                p.title,
                p.description,
                p.location,
                TO_CHAR(p.date, 'DD/MM/YYYY') AS date
            FROM project p
            JOIN project_category pc ON p.project_id = pc.project_id
            JOIN category c ON pc.category_id = c.category_id
            WHERE pc.category_id = $1
            ORDER BY p.date;
        `;

        const result = await db.query(query, [categoryId]);

        return result.rows;
    }
    catch (error) {
        console.error('Error fetching projects by category ID:', error);
        throw error;
    }
};

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getProjectsByCategoryId }; 