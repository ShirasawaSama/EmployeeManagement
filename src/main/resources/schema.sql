DROP TABLE IF EXISTS employees $$

create table employees(
    staff_id int unsigned NOT NULL AUTO_INCREMENT,
    staff_name varchar(20) NOT NULL DEFAULT '',
    staff_age tinyint unsigned DEFAULT 0,
    staff_gender tinyint unsigned DEFAULT 0,
    staff_picture text,
    staff_education text,
    staff_department text,
    staff_job text,
    PRIMARY KEY (staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 $$


DROP PROCEDURE IF EXISTS append_employees_data $$

CREATE PROCEDURE append_employees_data(cnt int)
BEGIN
    declare i int default 0;
    while i < cnt do
            INSERT INTO employees VALUES (NULL, CONCAT('staff', i), FLOOR(RAND() * 100), FLOOR(RAND() * 2),
                                          '', SUBSTR(MD5(RAND()), 1, 10), SUBSTR(MD5(RAND()), 1, 10), SUBSTR(MD5(RAND()), 1, 10));

            set i = i + 1;
        end while;
END $$
