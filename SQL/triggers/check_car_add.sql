
CREATE OR REPLACE TRIGGER check_add_car
BEFORE INSERT
ON CARS
FOR EACH ROW
DECLARE
    check_count NUMBER;
    cancelInsertion EXCEPTION;
BEGIN
    SELECT COUNT(*) INTO check_count
    FROM CARS 
    WHERE COLOR = :NEW.COLOR AND MODEL_NAME = :NEW.MODEL_NAME;
    
    IF( check_count <> 0 ) THEN 
        RAISE cancelInsertion;
    END IF;
EXCEPTION 
    WHEN cancelInsertion THEN
        RAISE_APPLICATION_ERROR(-20001, 'A car with the same color and model name already exists.');
    WHEN OTHERS THEN 
        DBMS_OUTPUT.PUT_LINE('ERROR');
END;
