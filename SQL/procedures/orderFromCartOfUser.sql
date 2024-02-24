CREATE OR REPLACE PROCEDURE orderFromCartOfUser (
    user_id IN NUMBER,
    order_state IN VARCHAR2,
    payment_method IN VARCHAR2,
    payment_status IN VARCHAR2,
    voucher_no IN NUMBER,
    showroom_id IN NUMBER,
	paid_amount IN NUMBER
) IS 
    user_found BOOLEAN := FALSE;
		res NUMBER;
		i NUMBER;
BEGIN
		i := 0;
	FOR R IN ( SELECT * FROM CART WHERE CUSTOMER_ID = user_id )
	LOOP
		IF ( i = 0 AND LOWER( R.CONFIRM_STATUS ) = 'not_confirmed' ) 
				THEN 
			res := orderFromCart( order_state ,payment_method ,payment_status, R.CART_ID, voucher_no,showroom_id,paid_amount );
			
			i := i+1;
			ELSIF LOWER( R.CONFIRM_STATUS) = 'not_confirmed' 
				THEN
			res := orderFromCart( order_state,payment_method, payment_status,R.CART_ID, voucher_no,showroom_id, 0 );		
		END IF;
		
	END LOOP;
END;