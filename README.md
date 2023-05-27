# SugarAIde
Made by team BBY-21 at BCIT for COMP2800 2023.

- Isaiah Youm (gardeneda)
 
- Hiroshi Nakasone (hiroshinaka)

- Ran Park (RanP90)

- Jimmy Nguyen (JimmyPPN)


## Project Description:
A simple application to help people at risk of diabetes by harnessing the power of AI and open source datasets to keep track of your diet and eating habits.

## Project Technologies:
To develop this application we used the following technologies:
- CSS
- BootStrap 5.3
- Javascript 
- Embedded Javascript
- Node.js
- MongoDB
- OpenAI 

## Files:

```
│   │       │
│   │       └───ms
│   │               server.js
│   │               license.md
|   |               dev.txt
│   │               package.json
|   |               Procfile
|   |               diabetes-analysis.ipynb
│   │               README.md
├───public
│   ├───css
│   │       calorieRequirment.css
│   │       chat.css
│   │       dailyReport.css
│   │       dietTrack.css
│   │       exerciseForm.css
│   │       exercisePage.css
│   │       foodHistory.css
│   │       global.css
│   │       healthinfo.css
│   │       home.css
│   │       login.css
│   │       main.css
│   │       profile.css
│   │       resources.css
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
│           dailyReport.js
│           dietTrack.js
│           exerciseForm.js
│           exercisePage.js
│           healthinfo.js
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
│   │       calorieRequirmentController.js
│   │       chatController.js
│   │       checkCaloriesController.js
│   │       dailyReportController.js
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
│   │       resourcesController.js
│   │       riskAssessController.js
│   │       signupController.js
│   │       todoController.js
│   │
│   ├───middleware
│   │       app.js
│   │
│   ├───routes
│   │       calorieRequirmentRouter.js
│   │       chatRouter.js
│   │       checkCaloriesRouter.js
│   │       dailyReportRouter.js
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
│   │       resourcesRouter.js
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
│       │   calorieRequirement.ejs
│       │   chat.ejs
│       │   checkCalories.ejs
│       │   dailyReport.ejs
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
│       │   resources.ejs
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

## Installation:
Programs required to work on this project:
- Microsoft Visual Studio Code (or any other IDE with JavaScript)
- Studio 3T (DB Management)
- Node.js  (Backend-Development)
- Express (Middleware)
- Cyclic,sh (Web hosting)

### VScode:
1. Visit the official website: https://code.visualstudio.com/
2. Download the installer for your operating system.
3. Run the installer.
4. Follow the prompts and choose your preferred installation options.
5. Accept the license agreement and proceed with the installation.
6. Wait for the installation to complete.
7. Launch Visual Studio Code.
8. The installation is now finished, and you can start using VS Code.

###  Cyclic.sh:
1. Open https://app.cyclic.sh/
2. Sign in with your GitHub account
3. Select “+ Deploy Now” to create new app
4. Select a name for the project
5. Select the git repo for the app
6. Click on the “Variables” tab
7. Enter variable values (Session secrets, database host, passwords)
8. Save variables
9. Go back to “Overview” tab
10. Select “Open App

### Node.js Installation: 
1. Install Node.js on your local desktop.
2. Check that it is at its most up-to-date version. 
3. Once the repo GitHub is pulled/cloned, in the directory type:
`Npm update`
4. All the modules listed on the package.json will be updated. 

### Studio 3T:
1. Download Studio 3T  
2. Set up a MongoDB Atlas account to set up a cloud database.
3. In Network access, make sure that the IP address is set to 0.0.0.0/0 so it can be used in any location.
4. Obtain the MongoDB for VS Code string to connect 3T studios to Atlas
5. Set up a new Connection in 3T studios. 



## Features:
### AI Virtual Assistant:
- The chat uses OpenAI API (model: da-vinci, text-completion, ver 3.5) to ask it questions with a customized AI prompt, combined with the user’s queries. We parse the AI’s response by converting it to a JSON, processing the JSON the chat gives and logging it into the user’s database, while sending casual conversations to the client-side. Through this, the user is able to log the foods they’ve eaten and the exercises they performed without having to know the specifics (such as calories, nutritional details, calories burnt and etc), increasing the QOL of the application. In the future, if more features are to be added, making this a voice-recognition would probably increase the QOL even further.

###  Risk Assessment:
- We performed a Multiple Linear Regression test on these two datasets to achieve the probability of someone getting diabetes with certain traits. These two datasets, however, were distinct, as one of them was more centered around a user’s lifestyle, and the other, around the user’s health information. Therefore, we compared the two probabilities to come up with our risk assessment formula to calculate the user’s risk to diabetes with their provided health info. This is a core functionality that dictates the identity of the app.
- Source:
- Diabetes Health Indicators Dataset
https://www.kaggle.com/datasets/alexteboul/diabetes-health-indicators-dataset

- Diabetes Prediction Dataset
	https://www.kaggle.com/datasets/iammustafatz/diabetes-prediction-dataset

### Daily Report:
- This feature calculates and summarizes the activity of the user on the previous day of the day they log-in. There, the users can track the calories they consumed, burnt, and net calories, as well as the change in their risk probability. The user is also given the option to view the list of foods they’ve eaten and the exercises they performed on that day. By doing this, we intend to give the user’s a feeling of progress and a reason to continue to use this application.

###  Food Log:
- SugarAIde provides a weekly interactive graph that, when clicked on, breaks down each food entry, showing its calories, sugar, carbs, and proteins for that day. In addition, the user is able to delete any food entry that’s logged.

###  Calories Tracker:
-  With the application, users can conveniently track their daily calorie and nutritional intake. They have the flexibility to customize their calorie requirement based on their activity level. The nutrient tracker captures crucial information like sugar, carbohydrates, protein, and fats from the food log, ensuring a comprehensive approach to monitoring nutrition.

The calorie tracker goes a step further by presenting users with a circular progress bar that showcases their maximum allowable calorie intake and their actual daily consumption. Similarly, for each nutrient, progress bars are used to display the maximum daily intake and the user's current intake. Additionally, if the maximum intake is exceeded, the tracker highlights this as well. These visual representations provide users with an intuitive understanding of their nutritional information, even if they are not familiar with the exact values, making it easier to comprehend their overall nutritional status.

###  Exercise Log:
- SugarAIde's exercise log feature allows users to visualize their data and keep track of their daily and weekly activities. A bar graph displays the total amount of time spent exercising for that week and a table shows the daily exercise. 
By using the chat option, the AI will automatically log the user's activity with an estimate of how many calories they burned. Users are also able to manually record their information using the exercise form. Where they can specify how many calories they burned. If the user completed weightlifting activities, they can also specify the number of repetitions, and sets. 

### ToDo List: 
- The AI is given the user’s health information in a modified prompt to generate customized daily To-Do lists for the user to do every day to improve their health. This is saved in the user’s database and is kept track of based on date. 

### Resources Page:
- This page contains additional links to non-profit organizations and research institutes that provide more detail for the user to access if they are seeking more information and additional tools to help manage their diabetes and their health. 

### Scheduler:
- A scheduler runs in the background, creating a ToDo list and a Daily Report for everyone at a specified time (12:00 AM PDT ) every day. This is done to minimize the load on the database, since generating these takes a bit of time.
 

## API Utilization:
### Usage
- The AI was used to automatically generate data for the foods and exercises that the user will ask to log the virtual assistant. When doing this, we will combine our customized prompt with the user’s query, and then send it as a request to the OpenAI API. The customized prompt is a specific set of instructions that tell what the AI needs to do in order to produce the data in the format that we want. Otherwise, the AI will produce inconsistent data formats and will ruin the data schema of our application. After receiving the response from the AI, we parse the response. Anything that is not in a JSON format will be parsed as leftover-messages, and everything that <i>is</i> JSON will be parsed by using JSON.parse().  This parsed data will be sent over to a function that will process the data and identify whether it is food data, or exercise data based on the properties it has. Then it will log the data to the user’s database, either in the exerciseLog, or the nutritionLog.
- Refer to AI Virtual Assistant
- The AI was also used to generate dynamic To-Do lists for the user by combining a customized prompt with the user’s health information. If they don’t have any, the AI will naturally ignore the empty user health fields and generate a generic to-do list to prevent diabetes, However, when the AI receives the user’s health information, it does a lot better in identifying user needs to prevent diabetes. 
- Refer to ToDo List


- The underlying theme for the risk assessment formula was NOT done by AI.


### Limitations
- The limitations that we encountered with the API is the fact that the data it produces are somewhat inconsistent. The nutritional value that they provide are the same 7 out of 10 times. This causes concern in terms of stability and credibility, because inconsistency in the data may produce inaccurate risk assessments. Not only this, but the values they provide are also different if the user queries vague food. For example, if they say “I ate a hamburger.” they may get different values because the AI assumes different kinds of hamburgers. A syntactical problem that we ran into was of how the AI will sometimes give us data in formats that cannot be parsed with JSON.parse(). To combat all of these problems, we dedicated a significant amount of time testing and customizing the prompt to feed the AI. As a result, the currently customized prompt is stable in producing consistent data formats.

## Credits:
Various HTML and styling codings were referenced from:
https://www.w3schools.com/

To style the button for the chatbot this link was referenced:
https://alvarotrigo.com/blog/css-round-button/

Message Bubble Templates (received chats) and (outgoing-chats) attained from 
Reference:  https://www.scaler.com/topics/chat-interface-project-css/

CSS and JS regarding how to implement the Circular Progress Bar has been attained from: 
Reference: https://www.youtube.com/watch?v=SKU2gExpkPI&ab_channel=CodingLab

Assets such as cards, navbars, footers, templates referenced from: 
https://getbootstrap.com/



## Contact information:
Jimmy Nguyen's github: https://github.com/JimmyPPN

Isiah Youm's gihub: https://github.com/gardeneda

Ran Park's github: https://github.com/RanP90

Hiroshi Nakasone's github: https://github.com/hiroshinaka


