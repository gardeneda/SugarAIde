const c = require(`${__dirname}/../src/controllers/chatController`);

/*
  checkJSONType() tests
*/

describe("Check if JSON are distinguished properly.", () => {
	test("If the JSON has a food, but no exercise it should produce 'food'", () => {
		const foodTest = {
			json: {
				food: "Cheeseburger",
				calories: 290,
				fat: "12 grams",
				carbohydrates: "30 grams",
				protein: "15 grams",
			},
			leftover: "Test #1"
		};

		expect(c.checkJSONType(foodTest)).toBe("food");
	});

	test("If the JSON has an exercise but no food it should produce 'exercise'", () => {
    const exerciseTest = {
      json: {
        exercise: "Bench Press",
        weight: 30,
        sets: 3,
        reps: 6,
        calories_burned: 90,
        duration_hours: 0.25,
      },
      leftover: undefined
    };

		expect(c.checkJSONType(exerciseTest)).toBe("exercise");
	});

	test("There is nothing in the object, and should produce 'fail'", () => {
		expect(c.checkJSONType({})).toBe("fail");
	});

	test("Has both food and exercise in its field, so should produce 'fail'", () => {
    const bothFieldsTest = {
      json: {
        food: "Cheeseburger",
        exercise: "Bench Press",
        weight: 30,
        sets: 3,
        reps: 6,
        calories_burned: 90,
        duration_hours: 0.25,
      },
      leftover: "Both Foods present"
    };

		expect(c.checkJSONType(bothFieldsTest)).toBe("fail");
	});
});

/*
  stripJSON() tests
*/

describe("Strip JSON from a string", () => {
	test("String without JSON, should just return the string. ", () => {
		const textWithJSON = `Some text`;

		expect(c.stripJSON(textWithJSON)).toEqual({
			json: null,
			leftover: `Some text`,
		});
  });

	test("String with JSON inside in the middle, should produce the JSON and leftover message as separate variables.", () => {
		const textWithJSON = ' for lunch.' +
    '\n' +
    '{\n' +
    '  "food": "Hamburger",\n' +
    '  "calories": "280",\n' +
    '  "fat": "12g",\n' +
    '  "sodium": "740mg",\n' +
    '  "carbohydrates": "33g",\n' +
    '  "protein": "14g"\n' +
    '}'

		expect(c.stripJSON(textWithJSON)).toEqual({
      json: {
        food: "Hamburger",
        calories: "280",
        fat: "12g",
        sodium: "740mg",
        carbohydrates: "33g",
        protein: "14g"
      },
      leftover: " for lunch.\n"
    });
  });
  
  test("String with only JSON, should produce json.", () => {
      const jsonFormat = '\n' +
      '{\n' +
      '  "food": "Cheeseburger",\n' +
      '  "calories": "290",\n' +
      '  "fat": "12g",\n' +
      '  "carbohydrates": "30g",\n' +
      '  "protein": "14g"\n' +
        '}'
    
    expect(c.stripJSON(jsonFormat)).toEqual({
      json: {
        food: "Cheeseburger",
        calories: "290",
        fat: "12g",
        carbohydrates: "30g",
        protein: "14g"
      },
      leftover: undefined
    });
  });



  expect

});
