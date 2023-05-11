const c = require(`${__dirname}/../src/controllers/chatController`);


describe("Check if JSON are distinguished properly.", () => {

  test("If the JSON has a food, but no exercise it should produce 'food'", () => {
  
    const foodTest = {
      food: "Cheeseburger",
      calories: 290,
      fat: "12 grams",
      carbohydrates: "30 grams",
      protein: "15 grams",
    };
  
  
    expect(c.checkJSONType(foodTest)).toBe("food");
  });
  
  test("If the JSON has an exercise but no food it should produce 'exercise'", () => {
  
    const exerciseTest = {
      "exercise": "Bench Press",
      "weight": 30,
      "sets": 3,
      "reps": 6,
      "calories_burned": 90,
      "duration_hours": 0.25
    };
  
  
    expect(c.checkJSONType(exerciseTest)).toBe("exercise");
  });
  
  test("There is nothing in the object, and should produce 'fail'", () => {
  
    const emptyTest = {
        
    }
    
    expect(c.checkJSONType(emptyTest)).toBe("fail");
  });

  test("Has both food and exercise in its field, so should produce 'fail'", () => {
  
    const bothFieldsTest = {
      "food": "Cheeseburger",
      "exercise": "Bench Press",
      "weight": 30,
      "sets": 3,
      "reps": 6,
      "calories_burned": 90,
      "duration_hours": 0.25
    };
    
    expect(c.checkJSONType(emptyTest)).toBe("fail");
  });
});

describe("Strip JSON from a string", () => {

  test("String without JSON, should just return the string. ", () => {
    const textWithJSON = `Some text`;

    expect(c.stripJSON(textWithJSON)).toBe(`Some text`);
  })

  test("", () => {
    const textWithJSON = `Some text before the JSON object {"name": "John", "age": 30} and after the JSON object.`;

    expect(c.stripJSON(textWithJSON)).toBe({
      json: { name: "John", age: 30 },
      leftover: "Some text before the JSON obejct and after the JSON object."
    });
  })
})
