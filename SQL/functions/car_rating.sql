CREATE OR REPLACE FUNCTION car_rating ( model_id IN NUMBER )
RETURN NUMBER IS 
    finalRating NUMBER;
    totalCount NUMBER;
    totalRating NUMBER;
BEGIN 
    totalCount := 0;
    totalRating := 0;
    FOR R IN ( SELECT * FROM rating
                WHERE MODEL_COLOR_ID = model_id )
    LOOP 
        totalCount := totalCount + 1;
        totalRating :=  totalRating + R.RATING;
    END LOOP;
    
    IF totalCount > 0 THEN
        finalRating := totalRating/totalCount;
    ELSE
        finalRating := 0;
    END IF;
    
    RETURN finalRating;
EXCEPTION
    WHEN NO_DATA_FOUND THEN 
        RETURN -1;
    WHEN OTHERS THEN
        RETURN -2;
END;