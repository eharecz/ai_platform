
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Model;

CREATE TABLE User(
    userId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(32) NOT NULL,
    password VARCHAR(32) NOT NULL,
    role VARCHAR(16),
    email VARCHAR(32),
    phone VARCHAR(32)
);

INSERT INTO User(username, password, role, email, phone) VALUES('admin', '21232f297a57a5a743894a0e4a801fc3', 'admin', 'eharecz@gmail.com', '15113132152');

CREATE TABLE Model(
    modelId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    modelName VARCHAR(64) NOT NULL,
    modelPath VARCHAR(64) NOT NULL,
    modelType VARCHAR(16) NOT NULL,
    authName VARCHAR(64),
    description VARCHAR(128),
    containerId VARCHAR(64),
    containerPort INTEGER
);
