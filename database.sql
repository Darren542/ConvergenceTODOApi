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
