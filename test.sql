CREATE TABLE usersW (
    id VARCHAR(40) PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO
    usersW (id, username, email, password)
VALUES (
        'u2',
        'imran',
        'imran@gmail.com',
        'abc123'
    ),
    (
        'u3',
        'rahul',
        'rahul@gmail.com',
        'pass789'
    );

SELECT * FROM usersW;

ALTER TABLE usersw ADD COLUMN COLLEGE_NAME VARCHAR(50) NOT NULL;

ALTER TABLE usersw MODIFY COLLEGE_NAME VARCHAR(120) NOT NULL;

INSERT INTO
    usersw (
        id,
        username,
        email,
        password,
        COLLEGE_NAME
    )
VALUES (
        1983,
        "JMHEl3lo123",
        "mjeet43052@gmail.com",
        "ok@1325",
        "Narula Institute Of Technology"
    );

USE DATABASE nit__college;
SELECT id, username, email
FROM usersW;
