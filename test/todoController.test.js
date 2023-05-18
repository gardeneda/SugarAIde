const t = require(`${__dirname}/../src/controllers/todoController`);

describe("Check if list of strings is parsed correctly.", () => {

    test("If the String list is a valid list, it should parse them into its own index in an array.", () => {

        const stringList = `
    
        1. Track and monitor your BMI each day.
        
        2. Calculate daily metabolism using the Harris-Benedict equation. 
        
        3. Talk to your doctor about your particular risk factors.
        
        4. Monitor your blood sugar levels and HbA1C regularly.
        
        5. Increase physical activity by incorporating exercise into your daily routine (e.g. 30 minutes of aerobic activity at least 5 days a week).
        
        6. Eat a balanced, reduced calorie, low fat diet with an emphasis on fresh fruits and vegetables.
        
        7. Reduce stress levels by practicing relaxation techniques such as yoga and/or meditation.
        
        8. Monitor and maintain healthy cholesterol and triglyceride levels.
        
        9. Cut out smoking and drinking alcohol if applicable.
        
        10. Take all prescribed medications accordingly.
        
        11. Have regular check-ups with your doctor and set achievable goals with them.`
        
        expect(t.parseListToArray(stringList)).toStrictEqual(
            [  
                "Track and monitor your BMI each day.",
                "Calculate daily metabolism using the Harris-Benedict equation.",
                "Talk to your doctor about your particular risk factors.",
                "Monitor your blood sugar levels and HbA1C regularly.",
                "Increase physical activity by incorporating exercise into your daily routine (e.g. 30 minutes of aerobic activity at least 5 days a week).",
                "Eat a balanced, reduced calorie, low fat diet with an emphasis on fresh fruits and vegetables.",
                "Reduce stress levels by practicing relaxation techniques such as yoga and/or meditation.",
                "Monitor and maintain healthy cholesterol and triglyceride levels.",
                "Cut out smoking and drinking alcohol if applicable.",
                "Take all prescribed medications accordingly.",
                "Have regular check-ups with your doctor and set achievable goals with them."
            ]
        );
    })

    test("If the String List is empty, it should return an empty array.", () => {
        expect(t.parseListToArray(" ")).toStrictEqual([]);
    })
})