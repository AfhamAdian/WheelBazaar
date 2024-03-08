CREATE OR REPLACE PROCEDURE edit_comment( id IN NUMBER, tex IN VARCHAR2 )
IS
	dummy NUMBER;
BEGIN 
	UPDATE comments
	SET COMMENT_TEXT = tex
	WHERE COMMENT_ID = id;
EXCEPTION 
	WHEN OTHERS THEN 
		DBMS_OUTPUT.PUT_LINE('ERROR');
END;