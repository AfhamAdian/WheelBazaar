CREATE OR REPLACE	FUNCTION addToCart (
	model_color_id IN NUMBER,
	customer_id IN NUMBER,
	confirm_status IN VARCHAR2
	) RETURN NUMBER IS
		max_id NUMBER;
	BEGIN 
			SELECT MAX( CART_ID ) INTO max_id
			FROM CART;
				
			IF max_id IS NULL THEN max_id := 1;
			ELSE max_id := max_id+1;
			END IF;
				
			INSERT INTO CART( CART_ID, MODEL_COLOR_ID, CUSTOMER_ID, CONFIRM_STATUS,CAR_COUNT)
			VALUES ( max_id, model_color_id, customer_id, confirm_status ,1);
			RETURN 1;
	EXCEPTION
			WHEN NO_DATA_FOUND THEN RETURN -1;
			WHEN OTHERS THEN RETURN -1;
	END;