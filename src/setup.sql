CREATE TABLE organization (
	organization_id serial primary key,
	orgname varchar(150) not null,
	description text not null,
	contact_email varchar(255) not null,
	logo_filename varchar(255) not null
);

insert into organization(orgname, description, contact_email, logo_filename)
values
	('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
	('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
	('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');		

CREATE TABLE project (
	"project_id" serial primary key,
	"organization_id" int not null,
	"title" varchar(150) not null,
	"description" text not null,
	"location" varchar(255) not null,
	"date" date not null,
	CONSTRAINT fk_organization 
		FOREIGN KEY (organization_id) 
		REFERENCES organization(organization_id)
		ON DELETE CASCADE
);

INSERT INTO project ("organization_id", "title", "description", "location", "date") VALUES
-- BrightFuture Builders (organization_id = 1)
(1, 'Community Center Renovation', 'Repairing and painting the local youth center.', '123 Main St, Springfield', '2026-10-05'),
(1, 'Affordable Housing Framing', 'Helping build wood frames for low-income housing units.', '456 Oak Rd, Madison', '2026-10-12'),
(1, 'Playground Safety Upgrade', 'Replacing old equipment and laying fresh wood chips.', 'City Park, Springfield', '2026-10-20'),
(1, 'Wheelchair Ramp Construction', 'Building custom accessibility ramps for senior citizens.', '789 Pine St, Lincoln', '2026-11-02'),
(1, 'Senior Home Winterization', 'Insulating windows and doors for elderly residents.', '321 Elm Ave, Springfield', '2026-11-15'),

-- GreenHarvest Growers (organization_id = 2)
(2, 'Urban Garden Planting', 'Planting seasonal vegetables in community plot beds.', '555 Harvest Way, Austin', '2026-09-28'),
(2, 'Compost Bin Construction', 'Building wooden compost bins for community recycling.', '777 Garden Blvd, Austin', '2026-10-08'),
(2, 'Fruit Tree Pruning Workshop', 'Teaching and assisting with seasonal orchard pruning.', 'Northside Community Orchard', '2026-10-18'),
(2, 'School Greenhouse Setup', 'Assembling a small greenhouse for an elementary school.', 'Lincoln Elementary School', '2026-11-01'),
(2, 'Harvest Food Distribution', 'Gathering fresh produce and bundling it for local pantries.', 'Downtown Community Market', '2026-11-20'),

-- UnityServe Volunteers (organization_id = 3)
(3, 'Downtown Food Drive', 'Collecting and packaging non-perishable goods for families.', 'Civic Center Plaza', '2026-10-01'),
(3, 'Park Cleanup & Beautification', 'Clearing litter and planting flowers along river trails.', 'Riverside Park', '2026-10-15'),
(3, 'After-School Tutoring Support', 'Assisting elementary students with math and reading.', 'Eastside Library', '2026-10-25'),
(3, 'Coat & Blanket Collection', 'Sorting donated winter gear for shelter distribution.', 'Community Warehouse', '2026-11-05'),
(3, 'Holiday Care Package Packing', 'Assembling care boxes for veterans and seniors.', 'Unity Hall', '2026-11-25');

CREATE TABLE category (
	category_id serial primary key,
	category_name varchar(255) not null
);

CREATE TABLE project_category (
	project_id int not null,
	category_id int not null,

	CONSTRAINT pk_project_category
		PRIMARY KEY (project_id, category_id),
		
	CONSTRAINT fk_project
		FOREIGN KEY (project_id)
		REFERENCES project(project_id)
		ON DELETE CASCADE,
		
	CONSTRAINT fk_category
		FOREIGN KEY (category_id)
		REFERENCES category(category_id)
		ON DELETE CASCADE
);

INSERT INTO category(category_name) VALUES
('Construction and Housing'),
('Environment and Sustainability'),
('Food Security'),
('Education and Tutoring'),
('Community Support'),
('Accessibility'),
('Senior Support');

INSERT INTO project_category (project_id, category_id) VALUES 
-- Projetos da BrightFuture Builders (project_id 1 a 5) 
(1, 1), (1, 5), 
(2, 1), (2, 5), 
(3, 1), (3, 5), 
(4, 1), (4, 5), (4, 6), (4, 7), 
(5, 1), (5, 5), (5, 7), 

-- Projetos da GreenHarvest Growers (project_id 6 a 10) 
(6, 2), (6, 3),	(6, 5), 
(7, 1), (7, 2), 
(8, 2), (8, 3), (8, 4), 
(9, 1), (9, 2), (9, 4), 
(10, 3), (10, 5), 

-- Projetos da UnityServe Volunteers (project_id 11 a 15) 
(11, 3), (11, 5),
(12, 2), (12, 5), 
(13, 4), (13, 5), 
(14, 5), 
(15, 5), (15, 7);

