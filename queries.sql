-- Create table to store information for each book added to the "Catalogue"
CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	title TEXT,
	rating INTEGER,
	image TEXT,
	note TEXT,
	isbn VARCHAR(45) UNIQUE
);