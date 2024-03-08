CREATE OR REPLACE FUNCTION check_add_new_car(id IN NUMBER,model IN VARCHAR2,clr IN VARCHAR2)
RETURN NUMBER IS
    cnt NUMBER;
    rt NUMBER;
BEGIN
    SELECT COUNT(*) INTO cnt
    FROM CARS
    WHERE COMPANY_ID = id AND LOWER(MODEL_NAME) = LOWER(model) AND LOWER(COLOR) = LOWER(clr);
    rt := 1;
    IF cnt = 0 THEN
        rt := 0;
    END IF;
    RETURN rt;
END;