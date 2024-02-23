CREATE OR REPLACE TRIGGER STOCK_DECREMENT
BEFORE INSERT
ON orderlist
FOR EACH ROW
DECLARE 
    amount NUMBER(5);
    cart_id NUMBER(15);
    ordered_amount NUMBER;
    e_insufficient_stock EXCEPTION;
BEGIN 
    SELECT cars.STOCK, cart.CART_ID, cart.CAR_COUNT INTO amount, cart_id, ordered_amount
    FROM CARS cars
    JOIN CART cart ON ( cars.MODEL_COLOR_ID = cart.MODEL_COLOR_ID )
    WHERE cart.CART_ID = :NEW.CART_ID;
      
    DBMS_OUTPUT.PUT_LINE( cart_id );
    DBMS_OUTPUT.PUT_LINE( amount );
        
    IF amount >= ordered_amount THEN 
        amount := amount - ordered_amount;
        DBMS_OUTPUT.PUT_LINE( amount );
        UPDATE CARS
        SET STOCK = amount
        WHERE MODEL_COLOR_ID = (SELECT MODEL_COLOR_ID FROM CART WHERE CART_ID = :NEW.CART_ID);
    ELSE 
        RAISE e_insufficient_stock;
    END IF;
    
EXCEPTION
    WHEN e_insufficient_stock THEN 
        DBMS_OUTPUT.PUT_LINE ( 'Insufficient stock to complete the order' );
        RAISE;
    WHEN NO_DATA_FOUND THEN 
        DBMS_OUTPUT.PUT_LINE ( 'NO DATA' );
    WHEN OTHERS THEN 
        DBMS_OUTPUT.PUT_LINE ( 'OTHERS' );
END;
/