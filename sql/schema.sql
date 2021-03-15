CREATE TABLE IF NOT EXISTS TVshows(
  id primary key,
  showName varchar(128) not null,
  releaseDate date,
  stillGoing boolean not null,
  tagline varchar(128),
  photo varchar(128),
  about varchar(400),
  language varchar(128),
  channel varchar(128),
  url varchar(128)
);

CREATE TABLE IF NOT EXISTS TVshowType(
  id primary key,
  typeName varchar(128) not null
);

CREATE TABLE IF NOT EXISTS TVconnect(
  id primary key,
  showName varchar(128) not null,
  typeName varchar(128) not null,
  foreign key (showName) references TVshows (showName),
  foreign key (typeName) references TVshowType (typeName),
);

CREATE TABLE IF NOT EXISTS TVseason(
	id primary key,
	showName varchar(128) not null,
	number int default 1,
	realeaseDate date,
	about varchar(400),
	photo varchar(128),
	foreign key (showName, releaseDate, about, photo) references TVshows(showName, releaseDate, about, photo)
);

CREATE TABLE IF NOT EXISTS episode(
	id primary key,
	showName varchar(128) not null,
	episodeName varchar(128) not null,
	number int default 1,
	realeaseDate date,
	about varchar(400),
	foreign key (showName, realeaseDate, about) references TVseason(showName, about, realeaseDate)
);

CREATE TABLE IF NOT EXISTS users (
	username varchar(32) not null unique,
	email varchar(64) not null unique,
    password varchar(64) not null,
	admin boolean default false 
);

CREATE TABLE IF NOT EXISTS userConnect (
	showName varchar(128) not null,
	episodeName varchar(128) not null,
	username varchar(32) not null unique,
	status varchar(64),
	rating int
);

