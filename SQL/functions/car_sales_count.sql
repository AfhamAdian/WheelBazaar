CREATE OR REPLACE FUNCTION car_sales_count (model_id IN NUMBER)
RETURN NUMBER
IS
    total NUMBER;
BEGIN
    total := 0;
    FOR R IN (SELECT * FROM ORDERLIST O1 JOIN CART CA1 
							ON ( O1.CART_ID = CA1.CART_ID )
							WHERE CA1.MODEL_COLOR_ID = model_id AND CA1.CONFIRM_STATUS = 'CONFIRMED'  )
    LOOP
        total := total + R.CAR_COUNT;
    END LOOP;
    RETURN total;
END;