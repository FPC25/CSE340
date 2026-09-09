import db from './db.js'

const getAllOrganizations = async() => {
  try {
    const query = `
        SELECT orgname, description, contact_email, logo_filename
      FROM public.organization;
    `;

    const result = await db.query(query);

    return result.rows;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
}

export {getAllOrganizations}  