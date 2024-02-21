
-- make sure to grant create procedure privilege to your database schema before creating the functions

CREATE OR REPLACE FUNCTION check_signup_criteria(
    in_email IN VARCHAR2,
    in_phone IN VARCHAR2
)   RETURN NUMBER IS
    email_cnt NUMBER;
    phone_cnt NUMBER;
BEGIN
    -- check if email already exists
    SELECT COUNT(*) INTO email_cnt
    FROM USERS
    WHERE EMAIL = in_email;

    IF email_cnt > 0 THEN
        -- email already exists, return 1
        RETURN 1;
    ELSE
        -- check if phone already exists
        SELECT COUNT(*) INTO phone_cnt
        FROM USERS
        WHERE PHONE_NUMBER = in_phone;

        IF phone_cnt > 0 THEN
            -- phone already exists, return 2
            RETURN 2;
        ELSE
            -- return 0 else
            RETURN 0;
        END IF;
    END IF;
END check_signup_criteria;



