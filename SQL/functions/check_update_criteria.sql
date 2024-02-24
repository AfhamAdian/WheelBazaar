CREATE OR REPLACE FUNCTION check_update_criteria(
    in_email IN VARCHAR2,
    in_phone IN VARCHAR2,
		in_id IN NUMBER
)   RETURN NUMBER IS
    email_cnt NUMBER;
    phone_cnt NUMBER;
BEGIN
    -- check if email already exists
    SELECT COUNT(*) INTO email_cnt
    FROM USERS
    WHERE EMAIL = in_email AND ID <> in_id;

    IF email_cnt > 0 THEN
        -- email already exists, return 1
        RETURN 1;
    ELSE
        -- check if phone already exists
        SELECT COUNT(*) INTO phone_cnt
        FROM USERS
        WHERE PHONE_NUMBER = in_phone AND ID <> in_id;

        IF phone_cnt > 0 THEN
            -- phone already exists, return 2
            RETURN 2;
        ELSE
            -- return 0 else
            RETURN 0;
        END IF;
    END IF;
END check_update_criteria;