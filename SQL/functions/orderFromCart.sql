CREATE OR REPLACE FUNCTION orderFromCart( 
    order_state IN VARCHAR2,
    payment_method IN VARCHAR2,
    payment_status IN VARCHAR2,
    cart_id1 IN NUMBER,
    voucher_no IN NUMBER,
    showroom_id IN NUMBER,
		paid_amount IN NUMBER
) RETURN NUMBER IS
    max_order_id NUMBER;
    price NUMBER;
BEGIN 
    SELECT NVL(MAX(ORDER_ID),0)+1 INTO max_order_id
    FROM orderList;
		
		DBMS_OUTPUT.PUT_LINE(cart_id1);
		
		SELECT ( CR1.CAR_COUNT * C1.PRICE ) INTO price
		FROM CARS C1 
		JOIN CART CR1 ON (C1.MODEL_COLOR_ID = CR1.MODEL_COLOR_ID)
		WHERE CR1.CART_ID = cart_id1;
		
		DBMS_OUTPUT.PUT_LINE( price );
        
        IF paid_amount > price THEN 
            price := 0;
        ELSE 
            price := price - paid_amount;
        END IF;

    INSERT INTO orderList( ORDER_ID, ORDER_DATE, ORDER_STATE, PAYMENT_METHOD, PAYMENT_STATUS, CART_ID, VOUCHER_NO, SHOWROOM_ID, DUE )
    VALUES ( max_order_id, SYSDATE, order_state, payment_method, payment_status, cart_id1, voucher_no, showroom_id, price );

    RETURN max_order_id;
EXCEPTION 
    WHEN OTHERS THEN 
        DBMS_OUTPUT.PUT_LINE('An Error Occurred: ' || SQLERRM);
        RETURN NULL;
END;