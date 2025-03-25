-- File: database/application/migrations/V1.1__remove_strain_remove_name_add_sex.sql

ALTER TABLE pigeons
DROP COLUMN strain,
DROP COLUMN name,
ADD COLUMN sex VARCHAR(10) NOT NULL;