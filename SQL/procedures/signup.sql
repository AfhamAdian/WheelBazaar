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