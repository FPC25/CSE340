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

export { getAllProjects, getProjectsByOrganizationId }; 