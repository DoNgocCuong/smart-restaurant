CREATE TABLE Tenant (
    tenantId INT AUTO_INCREMENT PRIMARY KEY,
    name_tenant VARCHAR(255),
    logo_url VARCHAR(255),
    phone VARCHAR(255),
    address VARCHAR(255),
    open_hours TIME,
    close_hours TIME,
    create_at DATETIME,
    update_at DATETIME
);

CREATE TABLE Permission (
    permissionId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE Status (
    statusId INT AUTO_INCREMENT PRIMARY KEY,
    orderStatus VARCHAR(255) NOT NULL
);

CREATE TABLE type_payment (
    typePaymentId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE Role (
    roleId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE Account (
    accountId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    is_first_activity BOOLEAN,
    is_email_verify BOOLEAN,
    is_customer BOOLEAN,
    is_active BOOLEAN,
    create_at DATETIME,
    update_at DATETIME,
    tenant_id INT,
    FOREIGN KEY (tenant_id) REFERENCES Tenant(tenantId)
);

CREATE TABLE Category (
    categoryId INT AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(255),
    tenant_id INT,
    is_active BOOLEAN,
    FOREIGN KEY (tenant_id) REFERENCES Tenant(tenantId)
);

CREATE TABLE Discount (
    discountId INT AUTO_INCREMENT PRIMARY KEY,
    value INT,
    minApply INT,
    maxApply INT,
    isActive BOOLEAN,
    discountType VARCHAR(255) NOT NULL,
    tenant_id INT,
    FOREIGN KEY (tenant_id) REFERENCES Tenant(tenantId)
);

CREATE TABLE modifier_group (
    modifierGroupId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    selection_type VARCHAR(255),
    is_required BOOLEAN,
    is_active BOOLEAN,
    tenant_id INT,
    FOREIGN KEY (tenant_id) REFERENCES Tenant(tenantId)
);

CREATE TABLE role_permission (
    role_id INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES Role(roleId),
    FOREIGN KEY (permission_id) REFERENCES Permission(permissionId)
);

CREATE TABLE account_role (
    account_id INT,
    role_id INT,
    PRIMARY KEY (account_id, role_id),
    FOREIGN KEY (account_id) REFERENCES Account(accountId),
    FOREIGN KEY (role_id) REFERENCES Role(roleId)
);

CREATE TABLE User (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(255),
    account_id INT UNIQUE,
    FOREIGN KEY (account_id) REFERENCES Account(accountId)
);

CREATE TABLE Customer (
    customerId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(255),
    address VARCHAR(255),
    gender VARCHAR(255),
    account_id INT UNIQUE,
    FOREIGN KEY (account_id) REFERENCES Account(accountId)
);

CREATE TABLE Employee (
    employeeId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(255),
    address VARCHAR(255),
    gender VARCHAR(255),
    is_employee BOOLEAN,
    account_id INT UNIQUE,
    FOREIGN KEY (account_id) REFERENCES Account(accountId)
);

CREATE TABLE Item (
    itemId INT AUTO_INCREMENT PRIMARY KEY,
    itemName VARCHAR(255),
    description TEXT,
    price DOUBLE,
    is_kitchen BOOLEAN,
    status BOOLEAN,
    quantity_sold INT DEFAULT 0,
    avatar_id INT,
    discount_id INT,
    create_at DATETIME,
    update_at DATETIME,
    FOREIGN KEY (discount_id) REFERENCES Discount(discountId)
);

CREATE TABLE Image (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255),
    item_id INT,
    FOREIGN KEY (item_id) REFERENCES Item(itemId)
);

CREATE TABLE modifier_option (
    modifierOptionId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price DOUBLE,
    is_active BOOLEAN,
    modifier_group_id INT,
    FOREIGN KEY (modifier_group_id) REFERENCES modifier_group(modifierGroupId)
);

CREATE TABLE item_category (
    item_id INT,
    category_id INT,
    PRIMARY KEY (item_id, category_id),
    FOREIGN KEY (item_id) REFERENCES Item(itemId),
    FOREIGN KEY (category_id) REFERENCES Category(categoryId)
);

CREATE TABLE modifier_group_item (
    item_id INT,
    modifierGroupId INT,
    PRIMARY KEY (item_id, modifierGroupId),
    FOREIGN KEY (item_id) REFERENCES Item(itemId),
    FOREIGN KEY (modifierGroupId) REFERENCES modifier_group(modifierGroupId)
);

CREATE TABLE restaurant_table (
    tableId INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(255),
    section VARCHAR(255),
    capacity INT,
    is_active BOOLEAN,
    statusTable VARCHAR(255),
    create_at DATETIME,
    update_at DATETIME,
    tenant_id INT,
    FOREIGN KEY (tenant_id) REFERENCES Tenant(tenantId)
);

CREATE TABLE Employee_table (
    employee_id INT,
    table_id INT,
    PRIMARY KEY (employee_id, table_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(employeeId),
    FOREIGN KEY (table_id) REFERENCES restaurant_table(tableId)
);

CREATE TABLE orders (
    orderId INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255),
    is_have_name BOOLEAN,
    special TEXT,
    discount FLOAT,
    subtotal FLOAT,
    tax INT,
    total FLOAT,
    create_at DATETIME,
    update_at DATETIME,
    table_id INT,
    status_id INT,
    customerId INT,
    FOREIGN KEY (table_id) REFERENCES restaurant_table(tableId),
    FOREIGN KEY (status_id) REFERENCES Status(statusId),
    FOREIGN KEY (customerId) REFERENCES Customer(customerId)
);

CREATE TABLE detail_order (
    detailOrderId INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    item_id INT,
    quantity INT,
    price DOUBLE,
    is_approved BOOLEAN,
    FOREIGN KEY (order_id) REFERENCES orders(orderId),
    FOREIGN KEY (item_id) REFERENCES Item(itemId)
);

CREATE TABLE Detail_order_modifier_option (
    detail_order_id INT,
    modifier_option_id INT,
    PRIMARY KEY (detail_order_id, modifier_option_id),
    FOREIGN KEY (detail_order_id) REFERENCES detail_order(detailOrderId),
    FOREIGN KEY (modifier_option_id) REFERENCES modifier_option(modifierOptionId)
);

CREATE TABLE payment (
    paymentId INT AUTO_INCREMENT PRIMARY KEY,
    amount DOUBLE,
    momo_trans_id VARCHAR(255),
    momo_request_id VARCHAR(255),
    momo_order_id VARCHAR(255),
    createAt DATETIME,
    status_id INT,
    order_id INT UNIQUE,
    type_payment_id INT,
    FOREIGN KEY (status_id) REFERENCES Status(statusId),
    FOREIGN KEY (order_id) REFERENCES orders(orderId),
    FOREIGN KEY (type_payment_id) REFERENCES type_payment(typePaymentId)
);

CREATE TABLE Review (
    reviewId INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT,
    create_at DATETIME,
    update_at DATETIME,
    is_active BOOLEAN,
    customer_id INT,
    item_id INT,
    FOREIGN KEY (customer_id) REFERENCES Customer(customerId),
    FOREIGN KEY (item_id) REFERENCES Item(itemId)
);

CREATE TABLE Qr_History (
    qrId INT AUTO_INCREMENT PRIMARY KEY,
    qr_url VARCHAR(255),
    active BOOLEAN,
    token VARCHAR(255),
    create_at DATETIME,
    update_at DATETIME,
    tableId INT,
    FOREIGN KEY (tableId) REFERENCES restaurant_table(tableId)
);

CREATE TABLE InvalidatedToken (
    id VARCHAR(255) PRIMARY KEY,
    token VARCHAR(1000) NOT NULL,
    expire_time DATETIME NOT NULL,
    account_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES Account(accountId)
);
CREATE TABLE Bank (
    bankId INT NOT NULL AUTO_INCREMENT,
    bankName VARCHAR(255),
    accountNumber VARCHAR(255),
    accountName VARCHAR(255),
    tenant_id INT,
    PRIMARY KEY (bankId),
    CONSTRAINT fk_bank_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES Tenant(tenantId)
);