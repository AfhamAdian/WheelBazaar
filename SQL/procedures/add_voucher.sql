CREATE OR REPLACE PROCEDURE add_voucher ( name IN VARCHAR2, discount_percentage IN NUMBER, valid IN VARCHAR2, adder IN VARCHAR2 )
IS
	id NUMBER;
BEGIN
	SELECT NVL(MAX(VOUCHER_NO),0)+1 INTO id 
	FROM VOUCHER;
	
	DBMS_OUTPUT.PUT_LINE(id);
	
	INSERT INTO VOUCHER ( VOUCHER_NO, VOUCHER_NAME, DISCOUNT, VALIDITY_DATE, ADD_TYPE)
	VALUES ( id, name, discount_percentage, TO_DATE(valid,'YYYY-MM-DD'), adder );
	
EXCEPTION 
	WHEN OTHERS THEN 
	    DBMS_OUTPUT.PUT_LINE('ERROR');
END;