CREATE OR REPLACE PROCEDURE add_car( name IN VARCHAR2, seat IN NUMBER, engine IN NUMBER, car_color IN VARCHAR2, car_price IN NUMBER, 
									l_date IN VARCHAR2, car_stock IN NUMBER, car_warranty IN NUMBER, comp_id IN NUMBER, url IN VARCHAR2, typ_id VARCHAR2, 
									v_id IN NUMBER )
IS
	count_check NUMBER;
	id NUMBER;
	url1 VARCHAR2(100);
	v_id1 NUMBER(15);
BEGIN 
	SELECT COUNT(*) INTO count_check
	FROM CARS
	WHERE COMPANY_ID = comp_id AND COLOR = car_color;
	
	IF (count_check = 0) THEN 
	
		SELECT NVL(MAX(MODEL_COLOR_ID),0)+1 INTO id
		FROM CARS;
			
		url1 := url;
		v_id1 := v_id;
		
		IF( url = -1 ) THEN 
			url1 := NULL;
		END IF;
		IF ( v_id = -1 ) THEN 
			v_id1 := NULL;
		END IF;
		 
		INSERT INTO CARS( MODEL_COLOR_ID,MODEL_NAME,SEAT_CAP,ENGINE_CAP,COLOR,PRICE,LAUNCH_DATE,STOCK,WARRANTY,COMPANY_ID,CAR_IMAGE_URL,TYPE_ID,VOUCHER_NO)
		VALUES ( id, name, seat, engine, car_color, car_price, TO_DATE(l_date, 'DD/MM/YYYY'), car_stock, car_warranty, comp_id, url1, typ_id,v_id1);
		//
	
	END IF;
EXCEPTION
	WHEN OTHERS THEN
		DBMS_OUTPUT.PUT_LINE ( 'ERROR' );

END;