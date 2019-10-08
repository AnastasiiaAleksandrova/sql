drop database if exists computerdb; 

create database computerdb;

use computerdb;

create table computer (
    id integer not null primary key,
    name varchar(20) not null,
    type varchar(20) not null,
    amount integer not null,
    price integer not null
);

insert into computer values (1, 'Beast', 'laptop', 100, 5000);

insert into computer values (2, 'Beauty', 'laptop', 300, 7000);

create user if not exists 'ella'@'localhost' identified by 'h2VxUiQh';

grant all privileges on computerdb.computer to 'ella'@'localhost';






