import bcrypt from 'bcrypt';
import db from './db.js'

const createUser = async(username, email, passwordHash) => {
    const default_role = 'user'
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id from roles WHERE role_name = $4))
        RETURNING user_id;
    `

    const queryParams = [username, email, passwordHash, default_role];
    const result = await db.query(query, queryParams)

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
}

const getAllUsers = async () => {
    const query = `
        SELECT 
            u.user_id,
            u.name,
            u.email,
            r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.name ASC
    `;

    const result = await db.query(query);

    return result.rows;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT 
            u.user_id,
            u.name,
            u.email, 
            u.password_hash, 
            r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async(email, password) => {
    const user = await findUserByEmail(email);

    if (user === null) {
        return null;
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
        return null;
    }

    const { password_hash, ...userWithoutPasswordHash } = user;
    return userWithoutPasswordHash;
}

const getProjectsByUserId = async (userId) => {
    const query = `
        SELECT
                p.project_id,
                u.user_id,
                p.title,
                p.description,
                p.location,
                p.date
            FROM project p
            JOIN project_volunteer pv ON p.project_id = pv.project_id
            JOIN users u ON pv.user_id = u.user_id
            WHERE u.user_id = $1
            ORDER BY p.date;
        `;
    
    const result = await db.query(query, [userId]);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Retrieved projects for user with ID', userId);
    }

    return result.rows;
}

const addProjectToUser = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (project_id, user_id) DO NOTHING
        RETURNING *;
    `;
    const result = await db.query(query, [userId, projectId]);

    const wasAdded = result.rowCount === 1;

    if (wasAdded && process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Project added to user with ID', userId);
    }

    return wasAdded;
};

const removeProjectFromUser = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteer
        WHERE user_id = $1 AND project_id = $2
        RETURNING *;
    `;
    const result = await db.query(query, [userId, projectId]);

    const wasRemoved = result.rowCount === 1;

    if (wasRemoved && process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Project removed from user with ID', userId);
    }

    return wasRemoved;
};

export {
    getAllUsers,
    createUser, 
    authenticateUser,
    addProjectToUser,
    removeProjectFromUser,
    getProjectsByUserId
};