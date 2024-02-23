CREATE OR REPLACE PROCEDURE orderFromCartOfUser (
    user_id IN NUMBER,
    order_state IN VARCHAR2,
    payment_method IN VARCHAR2,
    payment_status IN VARCHAR2,
    cart_id IN NUMBER,
    voucher_no IN NUMBER,
    showroom_id IN NUMBER
) IS 
    user_found BOOLEAN := FALSE;
		res NUMBER;
BEGIN
    FOR R IN (SELECT * FROM CART)
    LOOP
        IF R.CUSTOMER_ID = user_id THEN 
            user_found := TRUE;
-- 
            IF LOWER(R.CONFIRM_STATUS) = 'not_confirmed' THEN 
									res := orderFromCart(order_state, payment_method, payment_status, 																		cart_id, voucher_no, showroom_id);
            END IF;
        END IF;
    END LOOP;
-- 
    IF NOT user_found THEN
        DBMS_OUTPUT.PUT_LINE('NO SUCH USER ID FOUND');
    END IF;
END;