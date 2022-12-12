-- The database setup for the API's backend

CREATE database IF NOT EXISTS TODOAPI;

USE TODOAPI;

CREATE table IF NOT EXISTS user_accounts(
	userID int NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	username varchar(20) NOT NULL UNIQUE,
	isAdmin boolean DEFAULT FALSE,
	creationTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	pwHash varchar(150) NOT NULL,
	pwSalt varchar(150) NOT NULL,
	pwIterations int NOT NULL
);

INSERT INTO user_accounts (username, isAdmin, pwHash, pwSalt, pwIterations) 
VALUES ("Darren", 1, "47fc8a8159e64b8d790ea80c810737889d32a5e1e1cb7f824a792863817a5bda11a312f1c8739aea78b7f0166e20447f2db8c55c7a8b571c0514194707e51e55", "MabXaGmGVnWsYoAG63n8PA+hGCT01dKIO7YlJjdsFXQr+gOLvrq2olWjyadUdPT7Su0BHcA4f5L/caU8YtU9AA==", 100); --password is 123

CREATE TABLE IF NOT EXISTS todo_item(
	itemID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	ownerID int NOT NULL,
	todo_description varchar(500),
	todo_type varchar(25),
	creationTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (ownerID) REFERENCES user_accounts (userID)
		ON UPDATE CASCADE
);

INSERT INTO todo_item (itemID, ownerID, todo_description, todo_type)
VALUES (1, 1, "A test Todo", "TESTINGTODO");

CREATE TABLE IF NOT EXISTS todo_tags(
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	todoID int NOT NULL,
	tag_name varchar(25),
	FOREIGN KEY (todoID) REFERENCES todo_item (itemID)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);



--SELECT ti.itemID, ua.username, ti.todo_description, ti.todo_type, ti.creationTime
--FROM todo_item as ti, user_accounts as ua
--WHERE ti.ownerID = ua.userID AND ti.ownerID = 1;

--SELECT ti.itemID, ua.username, ti.todo_description, ti.todo_type, ti.creationTime
--    FROM todo_item as ti, user_accounts as ua
--    WHERE ti.ownerID = ua.userID AND ua.username = "Darren";