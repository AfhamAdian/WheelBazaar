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
	FOR R IN ( SELECT * FROM CART WHERE CUSTOMER_ID = user_id AND CONFIRM_STATUS = 'NOT_CONFIRMED' )
	LOOP
		IF payment_method = 'OP' AND payment_status = 'NOT_PAID' THEN
			IF ( i = 0)  THEN 
				res := orderFromCart( order_state ,payment_method ,payment_status, R.CART_ID, voucher_no,showroom_id,paid_amount );
				i := i+1;
			ELSE
				res := orderFromCart( order_state,payment_method, payment_status,R.CART_ID, voucher_no,showroom_id, 0 );		
			END IF;
		ELSIF payment_method = 'OP' AND payment_status = 'PAID' THEN 
			res := orderFromCart( order_state ,payment_method ,payment_status, R.CART_ID, voucher_no,showroom_id,paid_amount );
			i := i+1;	
		ELSIF payment_method = 'COD' THEN
			res := orderFromCart( order_state ,payment_method ,payment_status, R.CART_ID, voucher_no,showroom_id,paid_amount );
			i := i+1;		
		ELSE 
			i := 0;
		END IF;
	END LOOP;
END;