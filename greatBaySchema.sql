-- DELETE DATABASE IF IT EXISTS - greatBay_DB--
DROP DATABASE IF EXISTS greatBay_DB;
-- CREATE greatBay_DB --
CREATE DATABASE greatBay_DB;
-- USE DATABASE greatBay_DB --
USE greatBay_DB;
-- CREATE A TABLE CALLED, with the key.values of...  -- 
CREATE TABLE auctions
(
    -- creates a numeric column called "id" which will automatically increment its default value as we create new rows and cannot be NULL --
    id INT NOT NULL AUTO_INCREMENT,
    -- creates a string column with a maximum of 100 characters --
    item_name VARCHAR(100) NOT NULL,
    -- creates a string column with a maximum or 45 characters--
    category VARCHAR(45) NOT NULL,
    -- creates an numeric column with a default value of 0 if it is not already defined --
    starting_bid INT default 0,
    -- creates an numeric column with a default value of 0 if it is not already defined --
    highest_bid INT default 0,
    -- Sets the primary key of the table to id --
    PRIMARY KEY(id)
);
