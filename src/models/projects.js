import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT 
            p.organization_id, 
            p.title, 
            p.description, 
            p.location, 
            p.date, 
            o.orgname
        FROM project p
        JOIN organization o ON o.organization_id = p.organization_id
        Order by p.date ASC; 
    `;

    const result = await db.query(query);

    return result.rows;
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
    const query = `
        SELECT
            p.project_id,
            p.organization_id, 
            p.title, 
            p.description, 
            p.location, 
            p.date, 
            o.orgname
        FROM project p
        JOIN organization o ON o.organization_id = p.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;

    const result = await db.query(query, [number_of_projects]);

    return result.rows;
};

const getProjectDetails = async (projectId) => {
    const query = `
      SELECT
        p.project_id,
        p.organization_id,
        p.title,    
        p.description,
        p.location,
        p.date,
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
                p.date
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

/**
 * Creates a new project in the database.
 * @param {Int} organizationId - The organization id that is a foreign key in the table
 * @param {string} title - The title of the project.
 * @param {string} description - A description of the project.
 * @param {string} location - The location where the project will take place.
 * @param {date} date - The date that the project will happen. 
 * @returns {string} The id of the newly created project record.
 */
const createProject = async (organizationId, title, description, location, date) => {
    const query = `
        INSERT INTO project (organization_id, title, description, location, date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id
    `;

    const queryParams = [organizationId, title, description, location, date]
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}
 

const updateProject = async (projectId, organization_id, title, description, location, date) => {
    const query = `
        UPDATE project
        SET organization_id = $1, title = $2, description = $3, location = $4, date = $5
        WHERE project_id = $6
        RETURNING project_id;
    `
    
    const queryParams = [organization_id, title, description, location, date, projectId];
    const result = await db.query(query, queryParams)

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID', projectId);
    }

    return result.rows[0].project_id;
}


export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getProjectsByCategoryId, createProject, updateProject }; 