CREATE OR REPLACE PROCEDURE decrementCart(
c_id in NUMBER,
cnt IN NUMBER
) IS 
	BEGIN
	IF cnt = 0 THEN
		DELETE FROM CART WHERE CART_ID = c_id;
	ELSE
		UPDATE CART
		SET CAR_COUNT = cnt
		WHERE CART_ID = c_id;
	END IF;
	END;