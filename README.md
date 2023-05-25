SugarAIde
------------------------
Made by team BBY-21 at BCIT for term 1 2023.

- Isiah Youm (gardeneda)
 
- Hiroshi Nakasone (hiroshinaka)

- Ran Park (RanP90)

- Jimmy Nguyen (JimmyPPN)


Description:
-------------------------------------------------------
A simple application to help people at risk of diabetes by harnessing the power of AI and open source datasets to keep track of your diet and eating habits.

Technologies
--------------------------------------------------------
To develop this application we used the following technologies:
- CSS
- BootStrap 5.3
- Javascript 
- Embedded Javascript
- Node.js
- MongoDB
- OpenAI 
-

Files 
----------------------------------------------------------

```├───public
|
│   ├───css
│   │       resources.css      CSS for resources page
│   │       calorieRequirment.css   
│   │       chat.css
│   │       dietTrack.css
│   │       exerciseForm.css
│   │       exercisePage.css
│   │       global.css
│   │       home.css
│   │       login.css
│   │       main.css
│   │       profile.css
│   │       risk.css
│   │       signup.css
│   │       todo.css
│   │
│   ├───img
│   │       ADA.jpg
│   │       banner.png
│   │       diabetesCanada.jpg
│   │       do-the-robot.gif
│   │       health-icon.png
│   │       heart.png
│   │       logo.jpg
│   │       Mayo_clinic.jpg
│   │       NIHdiabetes.jpg
│   │       save.svg
│   │       sounds.ogg
│   │       sugaraide-favicon.png
│   │       sugarAIde-logo-black.svg
│   │       sugarAIde-logo-white.svg
│   │       sugaraide-logo.jpeg
│   │       sugarAIde-logo.svg
│   │       sugarAIdeLogo.png
│   │       temp_profile.jpg
│   │
│   └───js
│           calorieRequirement.js
│           chat.js
│           dietTrack.js
│           exerciseForm.js
│           exercisePage.js
│           main.js
│           profile.js
│           risk.js
│           todo.js
│
├───src
│   ├───config
│   │       databaseConfig.js
│   │
│   ├───controllers
│   │       resourcesController.js
│   │       calorieRequirmentController.js
│   │       chatController.js
│   │       checkCaloriesController.js
│   │       dietTrackController.js
│   │       exerciseController.js
│   │       exerciseFormController.js
│   │       foodHistoryController.js
│   │       forgotPasswordController.js
│   │       healthInfoController.js
│   │       loginController.js
│   │       mainController.js
│   │       profileController.js
│   │       resetPasswordController.js
│   │       riskAssessController.js
│   │       signupController.js
│   │       todoController.js
│   │
│   ├───middleware
│   │       app.js
│   │
│   ├───routes
│   │       resourcesRouter.js
│   │       calorieRequirmentRouter.js
│   │       chatRouter.js
│   │       checkCaloriesRouter.js
│   │       dietTrackRouter.js
│   │       exerciseFormRouter.js
│   │       exerciseRouter.js
│   │       foodHistoryRouter.js
│   │       forgotPasswordRouter.js
│   │       healthInfoRouter.js
│   │       loginRouter.js
│   │       mainRouter.js
│   │       profileRouter.js
│   │       resetPasswordRouter.js
│   │       riskAssessRouter.js
│   │       signupRouter.js
│   │       todoRouter.js
│   │
│   ├───utils
│   │       botManager.js
│   │       dateFormatter.js
│   │       navLinkManager.js
│   │       validation.js
│   │
│   └───views
│       │   resources.ejs
│       │   calorieRequirement.ejs
│       │   chat.ejs
│       │   checkCalories.ejs
│       │   dietTrack.ejs
│       │   exerciseForm.ejs
│       │   exercisePage.ejs
│       │   foodHistory.ejs
│       │   forgotPassword.ejs
│       │   health-consent.ejs
│       │   health-information.ejs
│       │   home.ejs
│       │   login.ejs
│       │   main.ejs
│       │   passwordUpdated.ejs
│       │   profile.ejs
│       │   resetPassword.ejs
│       │   risk-assessment.ejs
│       │   signup.ejs
│       │   todo.ejs
│       │
│       └───templates
│               footer.ejs
│               header.ejs
│               high-risk.ejs
│               low-risk.ejs
│               mid-risk.ejs
│               svg.ejs
│               todoTemplate.ejs
│
└───test
        chatController.test.js
        todoController.test.js
 ```

Installation:
-----------------------------------------------------------------


Features:
----------------------------------------------------------------
AI Virtual Assitant:

Nutrition Log:

Calories Tracker:

Exercise Log:

Risk Assessment:
 
Resources Page:

Credits:
-------------------------------------------------------------------

Entry point of the program is `server.js`
