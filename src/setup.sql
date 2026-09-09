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
	"organization_id" int references organization(organization_id) not null,
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
