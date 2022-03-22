CREATE DATABASE testing;
GRANT ALL PRIVILEGES ON testing.* TO 'admin'@'%';
USE testing;
-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2022-03-21 21:57:46.029

-- tables
-- Table: country
CREATE TABLE country (
    id_country varchar(5) NOT NULL,
    country varchar(255) NOT NULL,
    tr_id int NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT country_pk PRIMARY KEY (id_country)
);

-- Table: file
CREATE TABLE file (
    id_file int NOT NULL AUTO_INCREMENT,
    id_user int NOT NULL,
    id_folder int NOT NULL,
    path varchar(255) NOT NULL,
    storage varchar(255) NOT NULL,
    creation_date timestamp NOT NULL,
    private bool NOT NULL,
    tr_id int NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT file_pk PRIMARY KEY (id_file)
);

-- Table: folder
CREATE TABLE folder (
    id_folder int NOT NULL AUTO_INCREMENT,
    id_user int NOT NULL,
    path varchar(255) NOT NULL,
    creation_date timestamp NOT NULL,
    private bool NOT NULL,
    tr_id int NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT folder_pk PRIMARY KEY (id_folder)
) COMMENT 'Se crea automaticamente un folder para un usuario nuevo donde se encuentran sus archivos en home.';

-- Table: gender
CREATE TABLE gender (
    id_gender int NOT NULL AUTO_INCREMENT,
    gender varchar(25) NOT NULL,
    tr_id int NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT gender_pk PRIMARY KEY (id_gender)
);

-- Table: language
CREATE TABLE language (
    id_language varchar(5) NOT NULL,
    language varchar(255) NOT NULL,
    tr_id int NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT language_pk PRIMARY KEY (id_language)
);

-- Table: output
CREATE TABLE output (
    id_output int NOT NULL AUTO_INCREMENT,
    id_file int NOT NULL,
    status int NOT NULL,
    result varchar(500) NOT NULL,
    tr_id int NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT output_pk PRIMARY KEY (id_output)
);

-- Table: setting
CREATE TABLE setting (
    id_setting int NOT NULL AUTO_INCREMENT,
    id_user int NOT NULL,
    dark_light int NOT NULL,
    audio_feedback int NOT NULL,
    animations int NOT NULL,
    high_contrast int NOT NULL,
    font_size int NOT NULL,
    font_type varchar(50) NOT NULL,
    tr_id int NOT NULL,
    tr_date timestamp NOT NULL,
    tr_user_id int NOT NULL,
    tr_ip varchar(50) NOT NULL,
    CONSTRAINT setting_pk PRIMARY KEY (id_setting)
);

-- Table: tr_file
CREATE TABLE tr_file (
    id_file int NOT NULL,
    id_user int NOT NULL,
    id_folder int NOT NULL,
    path varchar(255) NOT NULL,
    storage varchar(255) NOT NULL,
    creation_date timestamp NOT NULL,
    private bool NOT NULL,
    tr_id int NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT tr_file_pk PRIMARY KEY (id_file)
);

-- Table: tr_folder
CREATE TABLE tr_folder (
    id_folder int NOT NULL,
    id_user int NOT NULL,
    path varchar(255) NOT NULL,
    creation_date timestamp NOT NULL,
    private bool NOT NULL,
    tr_id int NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT tr_folder_pk PRIMARY KEY (id_folder)
) COMMENT 'Se crea automaticamente un folder para un usuario nuevo donde se encuentran sus archivos en home.';

-- Table: tr_output
CREATE TABLE tr_output (
    id_output int NOT NULL,
    id_file int NOT NULL,
    status int NOT NULL,
    result varchar(500) NOT NULL,
    tr_id int NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT tr_output_pk PRIMARY KEY (id_output)
);

-- Table: tr_setting
CREATE TABLE tr_setting (
    id_setting int NOT NULL,
    user_id_user int NOT NULL,
    dark_light int NOT NULL,
    audio_feedback int NOT NULL,
    animations int NOT NULL,
    high_contrast int NOT NULL,
    font_size int NOT NULL,
    font_type varchar(50) NOT NULL,
    tr_id int NOT NULL,
    tr_date timestamp NOT NULL,
    tr_user_id int NOT NULL,
    tr_ip varchar(50) NOT NULL,
    CONSTRAINT tr_setting_pk PRIMARY KEY (id_setting)
);

-- Table: tr_user
CREATE TABLE tr_user (
    id_user int NOT NULL,
    id_country int NOT NULL,
    id_gender int NOT NULL,
    id_language int NOT NULL,
    name varchar(50) NULL,
    last_name varchar(50) NULL,
    username varchar(50) NOT NULL,
    email varchar(100) NOT NULL,
    password varchar(255) NOT NULL,
    picture varchar(255) NULL,
    status int NOT NULL,
    tr_id int NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT tr_user_pk PRIMARY KEY (id_user)
);

-- Table: user
CREATE TABLE user (
    id_user int NOT NULL AUTO_INCREMENT,
    id_country varchar(5) NOT NULL,
    id_gender int NOT NULL,
    id_language varchar(5) NOT NULL,
    name varchar(50) NULL,
    last_name varchar(50) NULL,
    username varchar(50) NOT NULL,
    email varchar(100) NOT NULL,
    password varchar(255) NOT NULL,
    picture varchar(255) NULL,
    status int NOT NULL,
    tr_id int NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT user_pk PRIMARY KEY (id_user)
);

-- foreign keys
-- Reference: file_folder (table: file)
ALTER TABLE file ADD CONSTRAINT file_folder FOREIGN KEY file_folder (id_folder)
    REFERENCES folder (id_folder);

-- Reference: file_user (table: file)
ALTER TABLE file ADD CONSTRAINT file_user FOREIGN KEY file_user (id_user)
    REFERENCES user (id_user);

-- Reference: folder_user (table: folder)
ALTER TABLE folder ADD CONSTRAINT folder_user FOREIGN KEY folder_user (id_user)
    REFERENCES user (id_user);

-- Reference: output_file (table: output)
ALTER TABLE output ADD CONSTRAINT output_file FOREIGN KEY output_file (id_file)
    REFERENCES file (id_file);

-- Reference: setting_user (table: setting)
ALTER TABLE setting ADD CONSTRAINT setting_user FOREIGN KEY setting_user (id_user)
    REFERENCES user (id_user);

-- Reference: user_country (table: user)
ALTER TABLE user ADD CONSTRAINT user_country FOREIGN KEY user_country (id_country)
    REFERENCES country (id_country);

-- Reference: user_gender (table: user)
ALTER TABLE user ADD CONSTRAINT user_gender FOREIGN KEY user_gender (id_gender)
    REFERENCES gender (id_gender);

-- Reference: user_language (table: user)
ALTER TABLE user ADD CONSTRAINT user_language FOREIGN KEY user_language (id_language)
    REFERENCES language (id_language);

-- End of file.
