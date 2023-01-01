use supermarket;
show tables;

drop table student;

-- SET SQL_SAFE_UPDATES=0;
 drop table login;
 
 create table department(
 d_id int auto_increment primary key ,
 d_name varchar(30) not null unique
 );
 
 -- drop table department;
 
 
 create table employee(
 emp_id int auto_increment primary key ,
 emp_name varchar(30) not null,
 emp_age int not null,
 emp_gender varchar(1) not null,
 salary int not null,
 emp_address varchar(100) not null,
 emp_mobileno bigint not null unique,
 d_id int,
 foreign key(d_id) references department(d_id)
 );
 
-- drop table employee;
 
 
 
 
create table login(
username varchar(20) not null unique,
password varchar(500) not null,
emp_id int,
foreign key(emp_id) references employee(emp_id) on delete cascade
);



-- drop table login;


create table supplier(
su_id int auto_increment primary key,
su_name varchar(30) not null,
su_address varchar(100) not null,
su_email varchar(30) not null unique,
su_mobileno bigint not null unique
);
-- drop table supplier;

create table suplogin(
username varchar(20) not null unique,
password varchar(500) not null,
su_id int,
foreign key(su_id) references supplier(su_id) on delete cascade
);
-- drop table suplogin;

create table product(
 p_id int auto_increment primary key,
 p_name varchar(40) not null unique,
 p_mrp float not null, 
 date_added timestamp not null default now(),
 min_qty int not null,
 stock_avail int not null default 0,
 su_id int,
 pc_perunit float,
 status varchar(7) not null default "low",
 check(status="ok" or status='low' or status='ordered'),
 foreign key (su_id) references supplier(su_id)
 
);

-- drop table product;

create table customer(
c_id int auto_increment primary key,
c_name varchar(30) not null,
c_gender varchar(1) not null,
date_visited timestamp not null default now(),
c_address varchar(100) not null,
c_mobileno bigint not null unique,
c_age int not null,
c_pts float not null default 0.00,
c_otp int
);

-- drop table customer;

create table transaction(
t_id int auto_increment primary key,
billed_date timestamp not null default now(),
final_amt float not null,
billed_amt float not null,
mop varchar(15) not null,
c_id int ,
emp_id int,
foreign key (c_id) references customer(c_id) on delete set null,
foreign key (emp_id) references employee(emp_id) on delete set null
);

-- drop table transaction;

create table location(
p_id int,
p_floor int not null,
p_row int not null,
p_column int not null,
p_rackno int not null,
foreign key (p_id) references product(p_id) on delete cascade
);

-- drop table location;

create table orders(
emp_id int,
p_id int not null,
date_received timestamp ,
date_ordered timestamp not null default now(),
qty int not null,
foreign key (emp_id) references employee(emp_id),
foreign key (p_id) references product(p_id)
);

-- drop table orders;

-- show create table departments;


-- create table discounts(
-- discount float not null,
-- date_modified 
-- );

create table tenders(
t_id int auto_increment primary key,
t_name varchar(50) not null,
t_opentime timestamp not null,
t_closetime timestamp not null,
t_status varchar(15) not null,
t_created timestamp default now(),
check(t_status="open" or t_status="closed" or t_status="upcoming" or t_status="selected"));

-- drop table tenders;

create table t_products(
 p_id int not null,
 t_id int not null,
 foreign key(p_id) references product(p_id) on delete cascade,
 foreign key(t_id) references tenders(t_id) on delete cascade);
 
--  drop table t_products;
 
 create table t_supplier(
 t_id int not null,
 su_id int not null,
 foreign key(t_id) references tenders(t_id) on delete cascade,
 foreign key(su_id) references supplier(su_id) on delete cascade
 );
 
--   drop table t_supplier;
  
 create table ternary(
 t_id int not null,
 su_id int not null,
 p_id int not null,
 cost float not null,
 foreign key(t_id) references tenders(t_id) on delete cascade,
 foreign key(su_id) references supplier(su_id) on delete cascade,
  foreign key(p_id) references product(p_id) on delete cascade);
 
--  drop table ternary;
 
 create table transaction_prod(
 t_id int not null,
 p_id int not null,
 quantity int not null,
 foreign key (p_id) references product(p_id) on delete cascade,
 foreign key(t_id) references transaction(t_id) on delete cascade
 )
-- drop table transaction_prod