CREATE DATABASE testing;
ALTER DATABASE testing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON testing.* TO 'admin'@'%';
USE testing;
-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2022-05-09 18:13:29.807

-- tables
-- Table: country
CREATE TABLE country (
    id_country varchar(5) NOT NULL,
    country varchar(255) NOT NULL,
    tr_id varchar(255) NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT country_pk PRIMARY KEY (id_country)
);

-- Table: file
CREATE TABLE file (
    id_file int NOT NULL AUTO_INCREMENT,
    folder_id_folder int NULL,
    user_id_user int NOT NULL,
    file_name varchar(255) NOT NULL,
    path varchar(255) NOT NULL,
    storage varchar(255) NOT NULL,
    creation_date timestamp NOT NULL,
    private bool NOT NULL,
    status int NOT NULL,
    tr_id varchar(255) NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT file_pk PRIMARY KEY (id_file)
);

-- Table: folder
CREATE TABLE folder (
    id_folder int NOT NULL AUTO_INCREMENT,
    user_id_user int NOT NULL,
    folder_name varchar(255) NOT NULL,
    path varchar(255) NOT NULL,
    storage varchar(255) NOT NULL,
    creation_date timestamp NOT NULL,
    private bool NOT NULL,
    status int NOT NULL,
    tr_id varchar(255) NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT folder_pk PRIMARY KEY (id_folder)
) COMMENT 'Se crea automaticamente un folder para un usuario nuevo donde se encuentran sus archivos en home.';

-- Table: gender
CREATE TABLE gender (
    id_gender int NOT NULL AUTO_INCREMENT,
    gender varchar(25) NOT NULL,
    tr_id varchar(255) NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT gender_pk PRIMARY KEY (id_gender)
);

-- Table: language
CREATE TABLE language (
    id_language varchar(5) NOT NULL,
    language varchar(255) NOT NULL,
    tr_id varchar(255) NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT language_pk PRIMARY KEY (id_language)
);

-- Table: output
CREATE TABLE output (
    id_output int NOT NULL AUTO_INCREMENT,
    file_id_file int NOT NULL,
    status int NOT NULL,
    result varchar(500) NOT NULL,
    tr_id varchar(255) NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT output_pk PRIMARY KEY (id_output)
);

-- Table: setting
CREATE TABLE setting (
    id_setting int NOT NULL AUTO_INCREMENT,
    user_id_user int NOT NULL,
    dark_light int NOT NULL,
    audio_feedback int NOT NULL,
    animations int NOT NULL,
    high_contrast int NOT NULL,
    font_size int NOT NULL,
    font_type varchar(50) NOT NULL,
    tr_id varchar(255) NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT setting_pk PRIMARY KEY (id_setting)
);

-- Table: tr_file
CREATE TABLE tr_file (
    tr_file_id int NOT NULL AUTO_INCREMENT,
    id_file int NOT NULL,
    folder_id_folder int NOT NULL,
    user_id_user int NOT NULL,
    file_name varchar(255) NOT NULL,
    path varchar(255) NOT NULL,
    storage varchar(255) NOT NULL,
    creation_date timestamp NOT NULL,
    private bool NOT NULL,
    status int NOT NULL,
    tr_id varchar(255) NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT tr_file_pk PRIMARY KEY (tr_file_id)
);

-- Table: tr_folder
CREATE TABLE tr_folder (
    tr_folder_id int NOT NULL AUTO_INCREMENT,
    id_folder int NOT NULL,
    user_id_user int NOT NULL,
    folder_name varchar(255) NOT NULL,
    path varchar(255) NOT NULL,
    storage varchar(255) NOT NULL,
    creation_date timestamp NOT NULL,
    private bool NOT NULL,
    status int NOT NULL,
    tr_id varchar(255) NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT tr_folder_pk PRIMARY KEY (tr_folder_id)
) COMMENT 'Se crea automaticamente un folder para un usuario nuevo donde se encuentran sus archivos en home.';

-- Table: tr_output
CREATE TABLE tr_output (
    tr_output_id int NOT NULL AUTO_INCREMENT,
    id_output int NOT NULL,
    file_id_file int NOT NULL,
    status int NOT NULL,
    result varchar(500) NOT NULL,
    tr_id varchar(255) NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT tr_output_pk PRIMARY KEY (tr_output_id)
);

-- Table: tr_setting
CREATE TABLE tr_setting (
    tr_setting_id int NOT NULL AUTO_INCREMENT,
    id_setting int NOT NULL,
    user_id_user int NOT NULL,
    dark_light int NOT NULL,
    audio_feedback int NOT NULL,
    animations int NOT NULL,
    high_contrast int NOT NULL,
    font_size int NOT NULL,
    font_type varchar(50) NOT NULL,
    tr_id varchar(255) NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT tr_setting_pk PRIMARY KEY (tr_setting_id)
);

-- Table: tr_user
CREATE TABLE tr_user (
    tr_id_user int NOT NULL AUTO_INCREMENT,
    id_user int NOT NULL,
    country_id_country varchar(5) NOT NULL,
    gender_id_gender int NOT NULL,
    language_id_language varchar(5) NOT NULL,
    name varchar(50) NULL,
    last_name varchar(50) NULL,
    username varchar(50) NOT NULL,
    email varchar(100) NOT NULL,
    password varchar(255) NOT NULL,
    picture varchar(255) NULL,
    status int NOT NULL,
    tr_id varchar(255) NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT tr_user_pk PRIMARY KEY (tr_id_user)
);

-- Table: user
CREATE TABLE user (
    id_user int NOT NULL AUTO_INCREMENT,
    country_id_country varchar(5) NOT NULL,
    gender_id_gender int NOT NULL,
    language_id_language varchar(5) NOT NULL,
    name varchar(50) NULL,
    last_name varchar(50) NULL,
    username varchar(50) NOT NULL,
    email varchar(100) NOT NULL,
    password varchar(255) NOT NULL,
    picture varchar(255) NULL,
    status int NOT NULL,
    tr_id varchar(255) NULL,
    tr_date timestamp NULL,
    tr_user_id int NULL,
    tr_ip varchar(50) NULL,
    CONSTRAINT user_pk PRIMARY KEY (id_user)
);

-- foreign keys
-- Reference: file_folder (table: file)
ALTER TABLE file ADD CONSTRAINT file_folder FOREIGN KEY file_folder (folder_id_folder)
    REFERENCES folder (id_folder);

-- Reference: file_user (table: file)
ALTER TABLE file ADD CONSTRAINT file_user FOREIGN KEY file_user (user_id_user)
    REFERENCES user (id_user);

-- Reference: folder_user (table: folder)
ALTER TABLE folder ADD CONSTRAINT folder_user FOREIGN KEY folder_user (user_id_user)
    REFERENCES user (id_user);

-- Reference: output_file (table: output)
ALTER TABLE output ADD CONSTRAINT output_file FOREIGN KEY output_file (file_id_file)
    REFERENCES file (id_file);

-- Reference: setting_user (table: setting)
ALTER TABLE setting ADD CONSTRAINT setting_user FOREIGN KEY setting_user (user_id_user)
    REFERENCES user (id_user);

-- Reference: user_country (table: user)
ALTER TABLE user ADD CONSTRAINT user_country FOREIGN KEY user_country (country_id_country)
    REFERENCES country (id_country);

-- Reference: user_gender (table: user)
ALTER TABLE user ADD CONSTRAINT user_gender FOREIGN KEY user_gender (gender_id_gender)
    REFERENCES gender (id_gender);

-- Reference: user_language (table: user)
ALTER TABLE user ADD CONSTRAINT user_language FOREIGN KEY user_language (language_id_language)
    REFERENCES language (id_language);

ALTER TABLE user AUTO_INCREMENT = 100;

-- End of file.

delimiter //
-- Trigger when a user is inserted and log it to the transaction table
CREATE TRIGGER tg_ins_tr_user AFTER INSERT ON user
    FOR EACH ROW
    BEGIN
        INSERT INTO tr_user VALUES (null, NEW.id_user, NEW.country_id_country, NEW.gender_id_gender, NEW.language_id_language, NEW.name, NEW.last_name, NEW.username, NEW.email, NEW.password, NEW.picture, NEW.status, NEW.tr_id , NEW.tr_date, NEW.tr_user_id, NEW.tr_ip);
    END;//
delimiter ;

delimiter //
-- Trigger when a user is updated and log it to the transaction table
CREATE TRIGGER tg_upd_tr_user AFTER UPDATE ON user
    FOR EACH ROW
    BEGIN
        INSERT INTO tr_user VALUES (null, NEW.id_user, NEW.country_id_country, NEW.gender_id_gender, NEW.language_id_language, NEW.name, NEW.last_name, NEW.username, NEW.email, NEW.password, NEW.picture, NEW.status, NEW.tr_id , NEW.tr_date, NEW.tr_user_id, NEW.tr_ip);
    END;//
delimiter ;

delimiter //
-- Create default values for settings for a new user
CREATE TRIGGER tg_ins_def_setting AFTER INSERT ON user
    FOR EACH ROW
    BEGIN
        INSERT INTO setting VALUES (null, NEW.id_user, 0, 0, 0, 0, 16, "Ubuntu Mono", NEW.tr_id , NEW.tr_date, NEW.tr_user_id, NEW.tr_ip);
    END;//
delimiter ;

delimiter //
-- Trigger when a setting is inserted and log it to the transaction table
CREATE TRIGGER tg_ins_tr_setting AFTER INSERT ON setting
    FOR EACH ROW
    BEGIN
        INSERT INTO tr_setting VALUES (null, NEW.id_setting, NEW.user_id_user,NEW.dark_light, NEW.audio_feedback, NEW.animations, NEW.high_contrast, NEW.font_size, NEW.font_type, NEW.tr_id , NEW.tr_date, NEW.tr_user_id, NEW.tr_ip);
    END;//
delimiter ;

delimiter //
-- Trigger when a setting is updated and log it to the transaction table
CREATE TRIGGER tg_upd_tr_setting AFTER UPDATE ON setting
    FOR EACH ROW
    BEGIN
        INSERT INTO tr_setting VALUES (null, NEW.id_setting, NEW.user_id_user, NEW.dark_light, NEW.audio_feedback, NEW.animations, NEW.high_contrast, NEW.font_size, NEW.font_type, NEW.tr_id , NEW.tr_date, NEW.tr_user_id, NEW.tr_ip);
    END;//
delimiter ;

delimiter //
-- Trigger when a folder is inserted and log it to the transaction table
CREATE TRIGGER tg_ins_tr_folder AFTER INSERT ON folder
    FOR EACH ROW
    BEGIN
        INSERT INTO tr_folder VALUES (null, NEW.id_folder, NEW.user_id_user,NEW.folder_name, NEW.path, NEW.storage, NEW.creation_date, NEW.private, NEW.status, NEW.tr_id , NEW.tr_date, NEW.tr_user_id, NEW.tr_ip);
    END;//
delimiter ;

delimiter //
-- Trigger when a folder is updated and log it to the transaction table
CREATE TRIGGER tg_upd_tr_folder AFTER UPDATE ON folder
    FOR EACH ROW
    BEGIN
        INSERT INTO tr_folder VALUES (null, NEW.id_folder, NEW.user_id_user,NEW.folder_name, NEW.path, NEW.storage, NEW.creation_date, NEW.private, NEW.status, NEW.tr_id , NEW.tr_date, NEW.tr_user_id, NEW.tr_ip);
    END;//
delimiter ;

delimiter //
-- Trigger when a file is inserted and log it to the transaction tabletaller.tr_file
CREATE TRIGGER tg_ins_tr_file AFTER INSERT ON file
    FOR EACH ROW
    BEGIN
        INSERT INTO tr_file VALUES (null, NEW.id_file, NEW.folder_id_folder,NEW.user_id_user, NEW.file_name, NEW.path, NEW.storage, NEW.creation_date, NEW.private, NEW.status, NEW.tr_id , NEW.tr_date, NEW.tr_user_id, NEW.tr_ip);
    END;//
delimiter ;

delimiter //
-- Trigger when a file is updated and log it to the transaction table
CREATE TRIGGER tg_upd_tr_file AFTER UPDATE ON file
    FOR EACH ROW
    BEGIN
        INSERT INTO tr_file VALUES (null, NEW.id_file, NEW.folder_id_folder, NEW.user_id_user, NEW.file_name, NEW.path, NEW.storage, NEW.creation_date, NEW.private, NEW.status, NEW.tr_id , NEW.tr_date, NEW.tr_user_id, NEW.tr_ip);
    END;//
delimiter ;

delimiter //
-- Trigger when a output is updated and log it to the transaction table
CREATE TRIGGER tg_ins_tr_output AFTER INSERT ON output
    FOR EACH ROW
    BEGIN
        INSERT INTO tr_output VALUES (null, NEW.id_output, NEW.file_id_file, NEW.status, NEW.result, NEW.tr_id , NEW.tr_date, NEW.tr_user_id, NEW.tr_ip);
    END;//
delimiter ;