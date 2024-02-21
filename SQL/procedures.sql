-- make sure to grant create procedure privilege to your database schema before creating the procedures

CREATE OR REPLACE PROCEDURE signup(
in_name in VARCHAR2,
in_email IN VARCHAR2,
in_phone IN NUMBER,
in_pass IN VARCHAR2
) IS 
	res NUMBER;
	id NUMBER;
	BEGIN
	res:=check_signup_criteria(in_email,in_phone);
	IF res = 0 THEN
		SELECT MAX(ID) INTO ID
		FROM USERS;
		id:=id+1;
		INSERT INTO USERS(ID,NAME,PASSWORD,EMAIL,PHONE_NUMBER,USER_TYPE)
		VALUES (id,in_name,in_pass,in_email,in_phone,'CU');
		INSERT INTO CUSTOMER(ID,ACCOUNT_CREATED_ON)
		VALUES (id,SYSDATE);
	END IF;
	END;


-- addTocCart procedure

CREATE OR REPLACE PROCEDURE addToCart (
	model_color_id IN NUMBER,
	customer_id IN NUMBER,
	showroom_id IN NUMBER,
	confirm_status IN VARCHAR2,
	voucher_no IN NUMBER
	) IS
		max_id NUMBER;
	BEGIN 
		SELECT MAX( CART_ID ) INTO max_id
		FROM CART;
			
		IF max_id IS NULL THEN max_id := 1;
		END IF;
			
		INSERT INTO CART( CART_ID, MODEL_COLOR_ID, CUSTOMER_ID, SHOWROOM_ID, CONFIRM_STATUS, VOUCHER_NO)
		VALUES ( max_id, model_color_id, customer_id, showroom_id, confirm_status, voucher_no);
	END;