-- TENANT (10 records)
INSERT INTO Tenant VALUES
(1,'Tenant A','logo1.png','0901','HCM','08:00','22:00',NOW(),NOW()),
(2,'Tenant B','logo2.png','0902','HN','09:00','23:00',NOW(),NOW()),
(3,'Tenant C','logo3.png','0903','DN','07:00','21:00',NOW(),NOW()),
(4,'Tenant D','logo4.png','0904','Hải Phòng','08:30','22:30',NOW(),NOW()),
(5,'Tenant E','logo5.png','0905','Cần Thơ','07:30','21:30',NOW(),NOW()),
(6,'Tenant F','logo6.png','0906','Đà Lạt','09:00','23:00',NOW(),NOW()),
(7,'Tenant G','logo7.png','0907','Nha Trang','08:00','22:00',NOW(),NOW()),
(8,'Tenant H','logo8.png','0908','Vũng Tàu','07:00','21:00',NOW(),NOW()),
(9,'Tenant I','logo9.png','0909','Huế','08:30','22:30',NOW(),NOW()),
(10,'Tenant J','logo10.png','0910','Quy Nhơn','09:00','23:00',NOW(),NOW());

-- PERMISSION (10 records)
INSERT INTO permission VALUES
(1,'CREATE_ORDER'),
(2,'UPDATE_ORDER'),
(3,'DELETE_ORDER'),
(4,'VIEW_REPORT'),
(5,'MANAGE_MENU'),
(6,'MANAGE_STAFF'),
(7,'MANAGE_TABLE'),
(8,'VIEW_KITCHEN'),
(9,'APPROVE_ORDER'),
(10,'MANAGE_DISCOUNT');

-- =========================
-- 3. ROLE
-- =========================
INSERT INTO role (name) VALUES
('TENANT_ADMIN'),
('SUPPER_ADMIN'),
('STAFF'),
('CUSTOMER'),
('KITCHEN_STAFF');

-- =========================
-- 4. ROLE_PERMISSION
-- =========================
INSERT INTO role_permission VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),
(2,1),(2,2),
(3,1);

-- =========================
-- 5. STATUS
-- =========================
INSERT INTO status VALUES
(1,'Paid'),
(2,'Pending_payment'),
(3,'Pending_approval'),
(4,'Approved'),
(5,'Rejected'),
(6,'Cooking'),
(7,'Cooked'),
(8,'Serving'),
(9,'Deleted');

-- =========================
-- 6. TYPE_PAYMENT
-- =========================
INSERT INTO type_payment VALUES
(1,'Tranfer'),
(2,'Cash'),
(3,'momoOrderId');


-- ACCOUNT (20 records)
INSERT INTO Account
(username, password, is_first_activity, is_email_verify, is_customer, is_active, create_at, update_at, tenant_id)
VALUES
('superadmin','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',0,1,0,1,NOW(),NOW(),1),
('staff','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',0,1,0,1,NOW(),NOW(),1),
('kitchen','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',1,1,1,1,NOW(),NOW(),1),
('customer','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',1,1,1,1,NOW(),NOW(),2),
('manager1','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',0,1,0,1,NOW(),NOW(),1),
('waiter1','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',0,1,0,1,NOW(),NOW(),1),
('waiter2','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',0,1,0,1,NOW(),NOW(),1),
('cashier1','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',0,1,0,1,NOW(),NOW(),2),
('kitchen1','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',0,1,0,1,NOW(),NOW(),2),
('kitchen2','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',0,1,0,1,NOW(),NOW(),3),
('customer2','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',1,1,1,1,NOW(),NOW(),1),
('customer3','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',1,1,1,1,NOW(),NOW(),1),
('customer4','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',1,1,1,1,NOW(),NOW(),2),
('customer5','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',1,1,1,1,NOW(),NOW(),3),
('customer6','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',1,1,1,1,NOW(),NOW(),1),
('staff2','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',0,1,0,1,NOW(),NOW(),2),
('staff3','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',0,1,0,1,NOW(),NOW(),3),
('delivery1','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',0,1,0,1,NOW(),NOW(),1),
('inventory1','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',0,1,0,1,NOW(),NOW(),2),
('admin2','$2a$10$FXN9AqpGyBLou88FfgRCseKapMCoiF44AVsGf7hu6M0oRYyPb9FJO',0,1,0,1,NOW(),NOW(),3);


-- ACCOUNT_ROLE
INSERT INTO account_role VALUES
(1,2),(2,3),(3,5),(4,4),
(5,1),(6,3),(7,3),(8,3),(9,5),
(10,5),(11,4),(12,4),(13,4),(14,4),
(15,4),(16,3),(17,3),(18,3),(19,3),(20,1);

-- USER (10 records)
INSERT INTO User VALUES
(1,'Admin User','0909',1),
(2,'Manager User','0912',5),
(3,'Waiter 1','0913',6),
(4,'Waiter 2','0914',7),
(5,'Cashier 1','0915',8),
(6,'Kitchen 1','0916',9),
(7,'Kitchen 2','0917',10),
(8,'Staff 2','0918',16),
(9,'Staff 3','0919',17),
(10,'Delivery 1','0920',18);

-- CUSTOMER (10 records)
INSERT INTO customer
(customerId, name, phone, address, gender, account_id)
VALUES
(1,'Nguyen A','0901','HCM','Female',2),
(2,'Trần Văn B','0921','Hà Nội','Male',3),
(3,'Lê Thị C','0922','Đà Nẵng','Female',4),
(4,'Phạm Văn D','0923','HCM','Male',5),
(5,'Hoàng Thị E','0924','Cần Thơ','Female',6),
(6,'Vũ Văn F','0925','Hải Phòng','Male',8),
(7,'Đặng Thị G','0926','Nha Trang','Female',7),
(8,'Bùi Văn H','0927','Huế','Male',9),
(9,'Ngô Thị I','0928','Đà Lạt','Female',10),
(10,'Đinh Văn J','0929','Vũng Tàu','Male',11),
(11,'Nguyen AA','0901','HCM','Female',12),
(12,'Trần Văn AB','0921','Hà Nội','Male',13),
(13,'Lê Thị AC','0922','Đà Nẵng','Female',14),
(14,'Phạm Văn AD','0923','HCM','Male',15),
(15,'Hoàng Thị AE','0924','Cần Thơ','Female',16),
(16,'Vũ Văn AF','0925','Hải Phòng','Male',17),
(17,'Đặng Thị AG','0926','Nha Trang','Female',18),
(18,'Bùi Văn AH','0927','Huế','Male',19),
(19,'Ngô Thị AI','0928','Đà Lạt','Female',20);

-- BANK (10 records)
INSERT INTO Bank VALUES
(1,'VCB','123456','TENANT A',1),
(2,'ACB','654321','TENANT B',2),
(3,'Techcombank','789012','TENANT C',3),
(4,'MB Bank','345678','TENANT D',4),
(5,'VietinBank','901234','TENANT E',5),
(6,'BIDV','567890','TENANT F',6),
(7,'Sacombank','123789','TENANT G',7),
(8,'TPBank','456123','TENANT H',8),
(9,'VPBank','789456','TENANT I',9),
(10,'SHB','012345','TENANT J',10);
-- CATEGORY (10 records)
INSERT INTO category VALUES
(1,'Food',1),
(2,'Drink',1),
(3,'Combo',1),
(4,'Appetizer',1),
(5,'Dessert',1),
(6,'Coffee',1),
(7,'Juice',1),
(8,'Salad',1),
(9,'Soup',2),
(10,'Seafood',3);
-- DISCOUNT (10 records)
INSERT INTO Discount VALUES
(1,10,100,500,1,'Fixed',1),
(2,20,200,1000,1,'Percent',1),
(3,15,150,600,1,'Fixed',2),
(4,25,250,1200,1,'Percent',2),
(5,30,300,1500,1,'Fixed',3),
(6,5,50,300,1,'Percent',1),
(7,40,400,2000,1,'Fixed',2),
(8,10,100,500,0,'Percent',1),
(9,50,500,2500,1,'Fixed',1),
(10,35,350,1800,1,'Percent',1);
-- ITEM (20 records)
INSERT INTO item VALUES
(1,'Burger','Beef burger',50000,1,1,10,NULL,1,NOW(),NOW()),
(2,'Pizza','Cheese pizza',80000,1,1,5,NULL,1,NOW(),NOW()),
(3,'Coke','Soft drink',20000,0,1,20,NULL,2,NOW(),NOW()),
(4,'French Fries','Crispy fries',30000,1,1,15,NULL,2,NOW(),NOW()),
(5,'Spring Rolls','Vietnamese spring rolls',35000,1,1,25,NULL,1,NOW(),NOW()),
(6,'Pho','Beef noodle soup',70000,1,1,30,NULL,3,NOW(),NOW()),
(7,'Iced Coffee','Vietnamese iced coffee',25000,0,1,40,NULL,2,NOW(),NOW()),
(8,'Banh Mi','Vietnamese sandwich',40000,1,1,35,NULL,1,NOW(),NOW()),
(9,'Fried Rice','Special fried rice',55000,1,1,20,NULL,3,NOW(),NOW()),
(10,'Grilled Chicken','Marinated grilled chicken',85000,1,1,12,NULL,2,NOW(),NOW()),
(11,'Seafood Hotpot','Mixed seafood hotpot',150000,1,1,8,NULL,4,NOW(),NOW()),
(12,'Mango Smoothie','Fresh mango smoothie',35000,0,1,45,NULL,2,NOW(),NOW()),
(13,'Tom Yum Soup','Thai spicy soup',65000,1,1,18,NULL,3,NOW(),NOW()),
(14,'Pad Thai','Thai stir-fried noodles',60000,1,1,22,NULL,1,NOW(),NOW()),
(15,'Green Tea','Hot green tea',15000,0,1,50,NULL,NULL,NOW(),NOW()),
(16,'Tiramisu','Italian dessert',45000,0,1,14,NULL,2,NOW(),NOW()),
(17,'Caesar Salad','Fresh caesar salad',50000,0,1,16,NULL,1,NOW(),NOW()),
(18,'Steak','Grilled beef steak',120000,1,1,9,NULL,4,NOW(),NOW()),
(19,'Sushi Set','Assorted sushi',95000,1,1,11,NULL,3,NOW(),NOW()),
(20,'Lemonade','Fresh lemonade',20000,0,1,38,NULL,NULL,NOW(),NOW());

-- IMAGE (20 records)
INSERT INTO image VALUES
(1,'burger.png',1),
(2,'pizza.png',2),
(3,'coke.png',3),
(4,'fries.png',4),
(5,'springrolls.png',5),
(6,'pho.png',6),
(7,'icedcoffee.png',7),
(8,'banhmi.png',8),
(9,'friedrice.png',9),
(10,'grilledchicken.png',10),
(11,'hotpot.png',11),
(12,'mango.png',12),
(13,'tomyum.png',13),
(14,'padthai.png',14),
(15,'greentea.png',15),
(16,'tiramisu.png',16),
(17,'salad.png',17),
(18,'steak.png',18),
(19,'sushi.png',19),
(20,'lemonade.png',20);

UPDATE item SET avatar_id=1 WHERE itemId=1;
UPDATE item SET avatar_id=2 WHERE itemId=2;
UPDATE item SET avatar_id=3 WHERE itemId=3;
UPDATE item SET avatar_id=4 WHERE itemId=4;
UPDATE item SET avatar_id=5 WHERE itemId=5;
UPDATE item SET avatar_id=6 WHERE itemId=6;
UPDATE item SET avatar_id=7 WHERE itemId=7;
UPDATE item SET avatar_id=8 WHERE itemId=8;
UPDATE item SET avatar_id=9 WHERE itemId=9;
UPDATE item SET avatar_id=10 WHERE itemId=10;
UPDATE item SET avatar_id=11 WHERE itemId=11;
UPDATE item SET avatar_id=12 WHERE itemId=12;
UPDATE item SET avatar_id=13 WHERE itemId=13;
UPDATE item SET avatar_id=14 WHERE itemId=14;
UPDATE item SET avatar_id=15 WHERE itemId=15;
UPDATE item SET avatar_id=16 WHERE itemId=16;
UPDATE item SET avatar_id=17 WHERE itemId=17;
UPDATE item SET avatar_id=18 WHERE itemId=18;
UPDATE item SET avatar_id=19 WHERE itemId=19;
UPDATE item SET avatar_id=20 WHERE itemId=20;

-- ITEM_CATEGORY
INSERT INTO item_category VALUES
(1,1),(2,1),(3,2),
(4,1),(5,4),(6,9),(7,2),(8,1),
(9,1),(10,1),(11,10),(12,2),(13,9),
(14,1),(15,2),(16,5),(17,8),(18,1),
(19,10),(20,7);

-- MODIFIER_GROUP (10 records)
INSERT INTO modifier_group VALUES
(1,'Size','SINGLE',1,1),
(2,'Topping','MULTIPLE',0,1),
(3,'Spice Level','SINGLE',1,1),
(4,'Extra Meat','MULTIPLE',0,2),
(5,'Sauce','MULTIPLE',0,1),
(6,'Side Dish','MULTIPLE',0,2),
(7,'Ice Level','SINGLE',1,3),
(8,'Sugar Level','SINGLE',1,3),
(9,'Cooking Level','SINGLE',1,1),
(10,'Add-ons','MULTIPLE',0,1);

-- MODIFIER_OPTION (20 records)
INSERT INTO modifier_option VALUES
(1,'Small',0,1),
(2,'Large',10000,1),
(3,'Cheese',5000,2),
(4,'Egg',7000,2),
(5,'Medium',0,1),
(6,'Extra Large',15000,1),
(7,'Mild',0,3),
(8,'Medium',0,3),
(9,'Hot',0,3),
(10,'Extra Beef',15000,4),
(11,'Extra Pork',12000,4),
(12,'Chili Sauce',3000,5),
(13,'Soy Sauce',2000,5),
(14,'Fries Side',20000,6),
(15,'Salad Side',15000,6),
(16,'Less Ice',0,7),
(17,'No Ice',0,7),
(18,'Less Sugar',0,8),
(19,'Rare',0,9),
(20,'Well Done',0,9);

-- MODIFIER_GROUP_ITEM
INSERT INTO modifier_group_item VALUES
(1,1),(1,2),(2,2),
(4,1),(5,3),(6,3),(7,7),(7,8),
(8,3),(9,3),(10,9),(11,4),(12,7),
(12,8),(13,3),(14,3),(18,9),(19,10);

-- RESTAURANT_TABLE (10 records)
INSERT INTO restaurant_table VALUES
(1,'T1','A',4,1,'unoccupied',NOW(),NOW(),1),
(2,'T2','A',6,1,'occupied',NOW(),NOW(),1),
(3,'T3','B',4,1,'unoccupied',NOW(),NOW(),1),
(4,'T4','B',6,1,'unoccupied',NOW(),NOW(),1),
(5,'T5','A',2,1,'occupied',NOW(),NOW(),2),
(6,'T6','C',8,1,'unoccupied',NOW(),NOW(),2),
(7,'T7','A',4,1,'occupied',NOW(),NOW(),3),
(8,'T8','B',6,1,'unoccupied',NOW(),NOW(),3),
(9,'T9','C',10,1,'unoccupied',NOW(),NOW(),1),
(10,'T10','A',4,1,'unoccupied',NOW(),NOW(),2);

-- EMPLOYEE (10 records)
INSERT INTO Employee VALUES
(1,'Staff A','090154365','HCM','MALE',1,2),
(2,'Staff B','090254365','Hà Nội','FEMALE',1,6),
(3,'Staff C','090354365','Đà Nẵng','MALE',1,7),
(4,'Staff D','090454365','HCM','FEMALE',1,8),
(5,'Staff E','090554365','Cần Thơ','MALE',1,9),
(6,'Staff F','090654365','Hải Phòng','FEMALE',1,10),
(7,'Staff G','090754365','Nha Trang','MALE',1,16),
(8,'Staff H','090854365','Huế','FEMALE',1,17),
(9,'Staff I','090954365','Đà Lạt','MALE',1,18),
(10,'Staff J','091054365','Vũng Tàu','FEMALE',1,19);

-- EMPLOYEE_TABLE
INSERT INTO Employee_table VALUES
(1,1),(1,2),
(2,3),(2,4),(3,5),(3,6),(4,7),
(4,8),(5,9),(5,10),(6,1),(6,2);

-- ORDERS (10 records)
INSERT INTO orders VALUES
(1,'Nguyen A',1,'No spicy',0,100000,10,110000,NOW(),NOW(),1,1,1),
(2,'Trần Văn B',1,'Extra spicy',5000,150000,15,160000,NOW(),NOW(),2,2,2),
(3,'Lê Thị C',1,'No MSG',0,200000,20,220000,NOW(),NOW(),3,1,3),
(4,'Phạm Văn D',1,'Less salt',10000,120000,12,122000,NOW(),NOW(),4,3,4),
(5,'Hoàng Thị E',1,'Well done',0,180000,18,198000,NOW(),NOW(),5,4,5),
(6,'Vũ Văn F',1,'No onion',8000,95000,10,103000,NOW(),NOW(),1,1,6),
(7,'Anonymous',0,'',0,75000,8,83000,NOW(),NOW(),6,2,NULL),
(8,'Bùi Văn H',1,'Extra sauce',0,165000,17,182000,NOW(),NOW(),7,5,2),
(9,'Ngô Thị I',1,'Hot',12000,140000,14,142000,NOW(),NOW(),8,6,3),
(10,'Đinh Văn J',1,'Medium',0,210000,21,231000,NOW(),NOW(),9,1,4);

-- DETAIL_ORDER (20 records)
INSERT INTO detail_order VALUES
(1,1,2,1,50000,1),
(2,1,3,1,20000,1),
(3,2,4,2,30000,1),
(4,2,5,1,35000,1),
(5,3,6,2,70000,1),
(6,3,7,1,25000,1),
(7,4,8,1,40000,1),
(8,4,9,1,55000,1),
(9,5,10,1,85000,1),
(10,5,11,1,150000,1),
(11,6,12,2,35000,1),
(12,7,13,1,65000,1),
(13,8,14,2,60000,1),
(14,8,15,1,15000,1),
(15,9,16,1,45000,1),
(16,9,17,1,50000,1),
(17,10,18,1,120000,1),
(18,10,19,1,95000,1),
(19,3,20,3,20000,1),
(20,5,3,1,20000,1);

-- DETAIL_ORDER_MODIFIER_OPTION
INSERT INTO Detail_order_modifier_option VALUES
(1,2),(1,3),
(3,1),(4,3),(5,8),(6,16),(7,9),
(8,10),(9,20),(10,11),(11,17),(12,7),
(13,12),(14,13),(15,18),(16,15),(17,19);

-- PAYMENT (10 records)
INSERT INTO payment VALUES
(1,110000,'m1','r1','o1',NOW(),3,1,1),
(2,160000,'m2','r2','o2',NOW(),1,2,2),
(3,220000,'m3','r3','o3',NOW(),1,3,2),
(4,122000,NULL,NULL,NULL,NOW(),2,4,2),
(5,198000,'m5','r5','o5',NOW(),4,5,1),
(6,103000,NULL,NULL,NULL,NOW(),1,6,2),
(7,83000,'m7','r7','o7',NOW(),2,7,1),
(8,182000,NULL,NULL,NULL,NOW(),5,8,2),
(9,142000,'m9','r9','o9',NOW(),6,9,1),
(10,231000,'m10','r10','o10',NOW(),1,10,1);

-- QR_HISTORY (10 records)
INSERT INTO Qr_History VALUES
(1,'qr1.png',1,'token1',NOW(),NOW(),1),
(2,'qr2.png',1,'token2',NOW(),NOW(),2),
(3,'qr3.png',1,'token3',NOW(),NOW(),3),
(4,'qr4.png',1,'token4',NOW(),NOW(),4),
(5,'qr5.png',1,'token5',NOW(),NOW(),5),
(6,'qr6.png',0,'token6',NOW(),NOW(),6),
(7,'qr7.png',1,'token7',NOW(),NOW(),7),
(8,'qr8.png',1,'token8',NOW(),NOW(),8),
(9,'qr9.png',0,'token9',NOW(),NOW(),9),
(10,'qr10.png',1,'token10',NOW(),NOW(),10);

-- REVIEW (10 records)
INSERT INTO Review VALUES
(1,'Good food',NOW(),NOW(),1,1,1),
(2,'Excellent service',NOW(),NOW(),1,2,2),
(3,'Delicious food',NOW(),NOW(),1,3,6),
(4,'Fast delivery',NOW(),NOW(),1,4,8),
(5,'Nice atmosphere',NOW(),NOW(),1,5,10),
(6,'Great taste',NOW(),NOW(),1,6,11),
(7,'Reasonable price',NOW(),NOW(),1,1,13),
(8,'Fresh ingredients',NOW(),NOW(),1,2,14),
(9,'Will come again',NOW(),NOW(),1,3,16),
(10,'Highly recommended',NOW(),NOW(),1,4,18);

-- INVALIDATED_TOKEN (10 records)
INSERT INTO InvalidatedToken VALUES
('t1','jwt-token',DATE_ADD(NOW(),INTERVAL 1 DAY),1),
('t2','jwt-token-2',DATE_ADD(NOW(),INTERVAL 1 DAY),2),
('t3','jwt-token-3',DATE_ADD(NOW(),INTERVAL 2 DAY),3),
('t4','jwt-token-4',DATE_ADD(NOW(),INTERVAL 1 DAY),4),
('t5','jwt-token-5',DATE_ADD(NOW(),INTERVAL 3 DAY),5),
('t6','jwt-token-6',DATE_ADD(NOW(),INTERVAL 1 DAY),6),
('t7','jwt-token-7',DATE_ADD(NOW(),INTERVAL 2 DAY),7),
('t8','jwt-token-8',DATE_ADD(NOW(),INTERVAL 1 DAY),8),
('t9','jwt-token-9',DATE_ADD(NOW(),INTERVAL 4 DAY),9),
('t10','jwt-token-10',DATE_ADD(NOW(),INTERVAL 1 DAY),10);