

CREATE SCHEMA IF NOT EXISTS kitchen_db;

USE kitchen_db;

CREATE TABLE meal_type(

    name        VARCHAR(140) NOT NULL,
    recipe_id   INT NOT NULL,
    PRIMARY KEY(name)

);

CREATE TABLE step_by_step
(
    id              INT NOT NULL AUTO_INCREMENT,
    step_number     INT NOT NULL,
    text            VARCHAR(140) NOT NULL,
    picture_uri     VARCHAR(256),
    PRIMARY KEY (id)
);



CREATE TABLE product
(
    name                VARCHAR(140) NOT NULL,
    amount              FLOAT NOT NULL,
    product_category    
        ENUM(
        'BREAD_AND_PASTRY', 
        'FRUITS', 
        'VEGETABLES', 
        'SPICES', 
        'GRAINS', 
        'DAIRY',
        'MEAT', 
        'SEAFOOD',
        'OTHERS',
        'DRINKS',
        'NONE',
        'FROZEN_AND_CONVENIENCE'
    ),
    nutrition_value     INT,
    measure_unit        
    ENUM(
        'ml', 
        'l', 
        'gr', 
        'kg', 
        'pieces', 
        'cup',
        'cups', 
        'tsp',
        'tbsp',
        'pinch',
        'none',
        'clove',
        'can',
        'cans',
        'slice',
        'slices'
    ),
    PRIMARY KEY (name)

);

-- -------------------
-- - Insert to product
-- -------------------

INSERT INTO product (name, amount, product_category, nutrition_value, measure_unit)
VALUES
(
    "ground-beef-10%",
    400,
    'MEAT',
    600,
    'gr'
);
INSERT INTO product (name, amount, product_category, nutrition_value, measure_unit)
VALUES
(
    "mamas-milk",
    200,
    'DAIRY',
    400,
    'ml'
);
INSERT INTO product (name, amount, product_category, nutrition_value, measure_unit)
VALUES
(
    "goat-cheese-set",
    200,
    'DAIRY',
    600,
    'gr'
);
INSERT INTO fridge_product (fridge_id, product_name) VALUES ('1','ground-beef-10%');
INSERT INTO fridge_product (fridge_id, product_name) VALUES ('1','mamas-milk');
INSERT INTO fridge_product (fridge_id, product_name) VALUES ('1','goat-cheese-set');

CREATE TABLE fridge(

    id          INT NOT NULL AUTO_INCREMENT,
    user        INT,
    PRIMARY key (id)

);

SELECT
    u.child_name,
    f.fridge_id, 
    f.product_name
    FROM user u
    INNER JOIN fridge_product f
            ON u.fridge_id = f.fridge_id
            WHERE u.id = '1';

SELECT
    r.title,
    r.preparation_time,
    p.name,
    f.fridge_id
    FROM product p
    INNER JOIN fridge_product f
            ON p.name = f.product_name
            INNER JOIN recipe r
                    ON f.fridge_id = r.fridge_id;


INSERT INTO fridge (user) VALUES('1');

CREATE TABLE fridge_product
(
    fridge_id      INT NOT NULL,
    product_name   VARCHAR(140) NOT NULL,
    FOREIGN KEY (fridge_id)    REFERENCES fridge(id)
                          ON UPDATE CASCADE
                          ON DELETE CASCADE,
    FOREIGN KEY (product_name) REFERENCES product(name)
                          ON UPDATE CASCADE
                          ON DELETE CASCADE                  
);

INSERT INTO recipe
(
    title,
    instructions,
    preparation_time,
    months_old,
    youtube_link,
    original_link,
    season,
    interesting_info,
    nutrition_value,
    storage_info,
    tips,
    is_fingerfood,
    updated_at,
    fridge_id
)
VALUES 
(
    'meatloaf',
    '1h in 200centigrades in oven',
    '60',
    '8',
    'youtu.be/xxx',
    'originallink.com/recipes/meatloaf-in-oven',
    'WINTER',
    '-',
    '240',
    'in fridge 3 days',
    'serve cold',
    '1',
    NOW(),
    '1'
);

CREATE TABLE recipe
(
    id                INT AUTO_INCREMENT,
    title             VARCHAR(140) NOT NULL,
    instructions      VARCHAR(4096),
    preparation_time  INT NOT NULL,
    months_old        INT NOT NULL,
    youtube_link      VARCHAR(256),
    original_link     VARCHAR(256),
    season            ENUM('SPRING', 'SUMMER', 'AUTUMN', 'WINTER'),
    interesting_info  VARCHAR(2048),
    nutrition_value   INT,
    storage_info      VARCHAR(255),
    tips              VARCHAR(2048),
    is_fingerfood     TINYINT(1),
    updated_at      DATETIME,
    fridge_id       INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (fridge_id) REFERENCES
                            fridge(id)
                            ON UPDATE CASCADE
                            ON DELETE CASCADE    
);

SELECT
    r.title,
    p.name
    FROM recipe r
    INNER JOIN product_recipe x
            ON r.id = x.recipe_id
            INNER JOIN product p
                    ON x.product_name = p.name;


CREATE TABLE product_recipe
(
    product_name       VARCHAR(140) NOT NULL,
    recipe_id          INT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipe (id)
                            ON DELETE RESTRICT
                            ON UPDATE CASCADE,
    FOREIGN KEY (product_name) REFERENCES product (name)
                            ON DELETE RESTRICT
                            ON UPDATE CASCADE                     
);
INSERT INTO product_recipe (product_name, recipe_id)
VALUES ('ground-beef-10%', '1');
CREATE TABLE user(

    id              INT AUTO_INCREMENT,
    age             INT NOT NULL,
    child_name      VARCHAR(140) NOT NULL,
    child_gender    ENUM('MALE', 'FEMALE'),
    country_from    VARCHAR(140),
    created_at      DATETIME,
    email           VARCHAR(256) NOT NULL,
    password        VARCHAR(256) NOT NULL,
    picture_uri     BLOB,
    updated_at      DATETIME,
    fridge_id       INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (fridge_id) REFERENCES
                            fridge(id)
                            ON UPDATE CASCADE
                            ON DELETE CASCADE
);

INSERT INTO user 
(
    age, 
    child_name, 
    child_gender,
    country_from,
    created_at,
    email,
    password,
    picture_uri,
    updated_at,
    fridge_id
)

CREATE TABLE article
(
    id              INT NOT NULL AUTO_INCREMENT,
    title           VARCHAR(140) NOT NULL,
    content         VARCHAR(4096) NOT NULL,
    likes           INT NOT NULL,
    description     VARCHAR(256) NOT NULL,
    author_id       INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (author_id) REFERENCES user(id)
                            ON UPDATE CASCADE
                            ON DELETE CASCADE
);
--CREATE TABLE step_by_step_update
--(
--    id              INT NOT NULL AUTO_INCREMENT,
--    recipe_id       INT NOT NULL,
--    step_number     INT NOT NULL,
--    text            VARCHAR(140) NOT NULL,
--    file_id         INT NOT NULL,
--    file            MEDIUMTEXT
--);

















SELECT * FROM user;

--INSERT INTO `kitchen_db`.`fridge` (`id`) VALUES ('1');
--
INSERT INTO `kitchen_db`.`user` (
    `age`, 
    `child_gender`, 
    `child_name`, 
    `country_from`, 
    `created_at`, 
    `date_of_birth`, 
    `email`, 
    `password`, 
    `picture_uri`,
    `updated_at`, 
    `fridge_id`
)
VALUES ('2', 'MALE', 'Test', 'Spain', '2020-01-01T22:22:22', NOW(), 'test@dev.com', 'password', '', null, '1');