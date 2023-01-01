use supermarket;

Select * from employee;
Select * from login;
Select * from department;
select * from supplier;
select * from suplogin;
select * from product;
select * from tenders;
select * from customer;
select * from transaction;

delete from customer where c_id=17;



alter table orders
add check(qty>0);
delete from orders where qty=0;
select * from location;
select * from transaction_prod;
select * from orders;

delete from orders where emp_id=17;
alter table customer
add c_otp int not null;


update customer set c_mobileno=9876532100 where c_id=1
update product set stock_avail=1;
delete from tb
alter table product
add status varchar(7) not null;
update product set status='ok';
update supplier set su_email='abdefgh@kaloory.com';
ALTER TABLE product
ADD CHECK (status='ok' or status='low' or status='ordered');


alter table customer
drop column status;

delete from customer where c_id=13;
update product set stock_avail=1 ;
update product set status='low' ;
update product set pc_perunit=5 ;
update customer set c_pts=50.60 where c_id=14;
update tenders set t_closetime='2020-10-29 19:13:00' where t_id=1;
select * from t_products;
select * from t_supplier;
select * from ternary;
delete from t_supplier where su_id=1;
select * from ternary group by p_id order by cost desc;
insert into ternary(t_id,su_id,p_id,cost) values(1,8,1,25);
delete from ternary where t_id=1;
insert into t_supplier(t_id,su_id) values(1,7);
delete from t_supplier where su_id=7;

truncate table tenders;

insert into supplier(su_name,su_address,su_email,su_mobileno) values('vishal reddy','sdasds','vishal123@kaloory.com',1234567890 )
delete from supplier where su_id=4 or su_id=6;
delete from tenders where t_id=1 or t_id=2;
truncate table tenders;
Update  product set p_name='abcd',p_mrp=40.3,min_qty=5,su_id=1,pc_perunit=30.3 where p_id=1
 ;

insert into product(p_name,p_mrp,min_qty,su_id,pc_perunit) values ('abcd', 45.3, 5, 2, 33.3);


alter table product
modify stock_avail int not null default 0;

alter table product
add column pc_perunit float not null
delete from supplier where su_id=1;
alter table supplier AUTO_INCREMENT=1;
truncate suplogin;
Select username,emp_id,d_name from (employee left join login on employee.emp_id=login.employee_id) natural join department  where username='manager'
-- basic

insert into department(d_name) values('security');
insert into employee(emp_name,emp_age,emp_gender,salary,emp_address,emp_mobileno,d_id) values('admin',19,'M',0,'Hyderabad',9876787652,1);

update login
set login.emp_id=1
where username='admin';

ALTER TABLE login CHANGE emp_id employee_id int;

desc login;

select * from supplier natural join product where supplier.su_id=product.su_id and su_id=1;


alter table employee
drop column role;

desc department;
select * from department;
insert into department(d_name) values('security');

alter table customer
add c_mobileno long not null;

select * from department;
select * from employee;

insert into employee(emp_name,emp_age,emp_gender,salary,emp_address,emp_mobileno,d_id) values('admin',19,'M',0,'Hyderabad',9876787652,1);


UPDATE employee 
join department 
set emp_name='Admin' 
where emp_id=1;

delete from login where emp_id<>1;

delete from product where p_id=4 or  p_id=7;

delete from supplier where su_id=3;
select * from suplogin;

insert into supplier(su_name,su_address,su_email,su_mobileno) values(?)

select * from product natural join (select * from supplier where supplier.su_id=1) as supplier ;
select * from product natural join (select * from supplier where supplier.su_id=1) as supplier ;
select * from product right join (select * from supplier where supplier.su_id=2) as supplier on product.su_id=supplier.su_id ;
desc employee;

Select * from tenders where t_id in (Select t_id from t_products natural join (select unique_id from t_suppliers where su_id = 

alter table product
add pc_perunit float;

select p_id,t_id,t_name,t_closetime,p_name,p_mrp from (select * from tenders where t_id=1) as tender natural join t_products natural join product;


select * from tenders where t_id not in (select t_id from t_supplier where su_id = 1);

Select * from ternary natural join product on ternary.p_id=product.p_id natural join tenders  on ternary.p_id=product.p_id and ternary.t_id=tenders.t_id where t_id=1 and su_id = 7;

Select suppliers.su_id,su_name,product.p_id,p_name,p_mrp,cost from product inner join (Select supplier.su_id,su_name,p_id,cost from ternary inner join supplier on ternary.su_id=supplier.su_id where t_id=${Number(req.params.id)}) as suppliers on suppliers.p_id=product.p_id order by product.p_id,cost;


