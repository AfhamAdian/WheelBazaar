CREATE OR REPLACE PROCEDURE add_voucher ( name IN VARCHAR2, discount_percentage IN NUMBER, valid IN VARCHAR2, adder IN VARCHAR2, model_id IN NUMBER )
IS
	id NUMBER;
BEGIN
	SELECT NVL(MAX(VOUCHER_NO),0)+1 INTO id 
	FROM VOUCHER;
	
	DBMS_OUTPUT.PUT_LINE(id);
	
	INSERT INTO VOUCHER ( VOUCHER_NO, VOUCHER_NAME, DISCOUNT, VALIDITY_DATE, ADD_TYPE)
	VALUES ( id, name, discount_percentage, TO_DATE(valid,'DD/MM/YYYY'), adder );
	
	UPDATE cars
	SET VOUCHER_NO = id
	WHERE MODEL_COLOR_ID = model_id;
	
EXCEPTION 
	WHEN OTHERS THEN 
	    DBMS_OUTPUT.PUT_LINE('ERROR');
END;