# TypeScript practice project
Project to practice on TypeScript back-end and MongoDB, using Mongoose library.
## Description
In this project was realized 2 main features: work with database items (with name, cost and amount values) and work with users (with name, email, password and possibilities fields), for which I've added new interface to Express.
Each of them has own controller file with routing and service file with most functionality, which is imported to controller. Also each of them has DTO files,which describes expected data type. All application built using NodeJS and dependency injection via injectable and inversify libraries. Each instance of class, which imported to another file, is a single one, because of using inSingletonScope property. All dependencies built via interfaces, which allows you to change the class to any other that meets the requirements of the interface.
Also I add in project simple front-end part to run it on browser instead of Insomnia (Postman analog) and for Heroku implementation.
### Main functionality of project
First user go to Home page where he can see only two buttons: login and register. Registration add his profile data to database and allow him to login with it. Entered password saved in database encrypted using bcryptjs.
User can login via entered his email and password or using Google or Facebook authentication via oauth2.0. After user logged in his id saved in cookies. Now homepage updated via ajax and user can do 4 main operations with items: create, read, update or delete using corresponding buttons. Also on top of page there are links to all of this operation pages and home, available from any page.
For "create" operation user must fill all fields for adding it to database. Because MongoDB is non-relational database, I've added additional field with creator ID to item scheme.
In "read" operation user can fill all or at least one field and it'll return all results, that've founded with View button below each result. Pressing on it will redirect user to item page with all data about it and Change and Delete buttons below.
For "change" operation user must fill at least one field with "old" prefix and at least one for "new". For each founded result, which fulfill search result, would be applied changes in fields with "new" prefix. Changes will apply only for items, which was created by user.
"Delete" operation will delete all documents in database, founded by searching using filled fields as key and if them creator is user.
