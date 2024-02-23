DECLARE 
    amount NUMBER(5);
    cart_id NUMBER(15);
		ordered_amount NUMBER;
BEGIN 
    SELECT cars.STOCK, cart.CART_ID, cart.CAR_COUNT INTO amount, cart_id, ordered_amount
    FROM CARS cars
    JOIN CART cart ON ( cars.MODEL_COLOR_ID = cart.MODEL_COLOR_ID )
    WHERE cart.CART_ID = :NEW.CART_ID;
      
    DBMS_OUTPUT.PUT_LINE( cart_id );
		DBMS_OUTPUT.PUT_LINE( amount );
        
    IF amount > 0 THEN 
        amount := amount - ordered_amount;
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