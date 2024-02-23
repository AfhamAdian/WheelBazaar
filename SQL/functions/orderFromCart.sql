CREATE OR REPLACE FUNCTION orderFromCart( 
    order_state IN VARCHAR2,
    payment_method IN VARCHAR2,
    payment_status IN VARCHAR2,
    cart_id IN NUMBER,
    voucher_no IN NUMBER,
    showroom_id IN NUMBER
) RETURN NUMBER IS
    max_order_id NUMBER;
BEGIN 
    SELECT NVL(MAX(ORDER_ID),0)+1 INTO max_order_id
    FROM orderList;
				
    INSERT INTO orderList( ORDER_ID, ORDER_DATE, ORDER_STATE, PAYMENT_METHOD, PAYMENT_STATUS, CART_ID, VOUCHER_NO, SHOWROOM_ID)
    VALUES ( max_order_id, SYSDATE, order_state, payment_method, payment_status, cart_id, voucher_no, showroom_id );

    RETURN max_order_id;
EXCEPTION 
    WHEN OTHERS THEN 
        DBMS_OUTPUT.PUT_LINE('An Error Occurred: ' || SQLERRM);
        RETURN NULL;
END;
/