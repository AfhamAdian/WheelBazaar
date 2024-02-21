-- CART_ORDERED trigger
-- REUDCES STOCK WHEN A CAR IS ORDERED
CREATE OR REPLACE TRIGGER CART_ORDERED 
AFTER INSERT
ON orderlist
FOR EACH ROW
DECLARE 
    amount NUMBER(5);
    cart_id NUMBER(15);
BEGIN 
    SELECT cars.STOCK, cart.CART_ID INTO amount, cart_id
    FROM CARS cars
    JOIN CART cart ON ( cars.MODEL_COLOR_ID = cart.MODEL_COLOR_ID )
    WHERE cart.CART_ID = :NEW.CART_ID;
      
    DBMS_OUTPUT.PUT_LINE( cart_id );
		DBMS_OUTPUT.PUT_LINE( amount );
        
    IF amount > 0 THEN 
        amount := amount - 1;
        DBMS_OUTPUT.PUT_LINE( amount );
        UPDATE CARS
        SET STOCK = amount
        WHERE MODEL_COLOR_ID = (SELECT MODEL_COLOR_ID FROM CART WHERE CART_ID = :NEW.CART_ID);
    ELSE 
        DBMS_OUTPUT.PUT_LINE('No update was made');
    END IF;
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN DBMS_OUTPUT.PUT_LINE ( 'NO DATA' );
    WHEN OTHERS THEN DBMS_OUTPUT.PUT_LINE ( 'OTHERS' );
END;