CREATE OR REPLACE PROCEDURE pay_due_amount(
in_amount IN NUMBER,
in_orderId IN NUMBER
) IS 
    due_amount NUMBER;
BEGIN
	SELECT DUE INTO due_amount 
	FROM ORDERLIST
	WHERE ORDER_ID = in_orderId;
	
	UPDATE ORDERLIST
	SET DUE = (due_amount - in_amount)
	WHERE ORDER_ID = in_orderId;

    IF due_amount = in_amount THEN 
        UPDATE ORDERLIST
	    SET PAYMENT_STATUS = 'PAID'
	    WHERE ORDER_ID = in_orderId;
    END IF;
END;