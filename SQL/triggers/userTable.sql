
-- grant create trigger privilege to your database schema before creating the triggers

-- LOGIN IN SQL PLUS , SYSTEM WITH PASWORD
-- GRANT CREATE TRIGGER TO <your_schema_name>;

CREATE OR REPLACE TRIGGER USER_BACKUP
AFTER INSERT
ON users
FOR EACH ROW
DECLARE
    id NUMBER;
    name VARCHAR2(50);
    password VARCHAR2(20);
    email VARCHAR2(50);
    phone NUMBER(15);
    user_type VARCHAR2(2);
    created_on DATE;
BEGIN 
    id := :NEW.ID;
    name := :NEW.NAME;
    password := :NEW.PASSWORD;
    email := :NEW.EMAIL;
    phone := :NEW.PHONE_NUMBER;
    user_type := :NEW.USER_TYPE;
    created_on := SYSDATE;
    INSERT INTO user_backup( ID, NAME, PASSWORD, EMAIL, PHONE_NUMBER, USER_TYPE, ACCOUNT_CREATED_ON )
    VALUES ( id, name, password, email, phone, user_type, created_on );
END;
/