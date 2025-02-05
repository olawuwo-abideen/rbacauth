A role-based access control (RBAC) system

Installation

- clone the repository


`git clone git@github.com:olawuwo-abideen/rbacauth.git`


- navigate to the folder


`cd rbacauth-main.git`

To run the app in development mode

Open a terminal and enter the following command to install all the  modules needed to run the app:

`npm install`


Create a `.env` file with

`MONGODB_URI= mongodb://localhost:27017/rbac`

`JWT_SECRET=secret`

`JWT_EXPIRES=3d`

Enter the following `npm run start:dev` command to Command Line Interface to Start the app

This will start the app and set it up to listen for incoming connections on port 3000. 

Use Postman or open api to test the endpoint

Open API endpoints = http://localhost:3000/api/

Postman endpoints

The following API endpoints are available:

- BaseUrl https://localhost:3000/signup

- `POST /signup` - Create user for admin or shipper or carrier

{

"firstname": "Olawuwo Abideen",

"lastname": "Olawuwo Abideen",

"email": "janedoe@gmail.com",

"password": "Password123--",

"confirmpassword": "Password123--",

"role": "admin | shipper | carrier "

"phonenumber": "08012345678"

}

* Response: 201 Created on success, 400 Bad Request on failure.

A token will be generated copy the token and paste to the header section for authorization.

- `POST /login` - Login

{

"email": "janedoe@gmail.com",

password": "Password123--"

}

A token will be generated copy the token and paste to the header section for authorization.

* Response: 200 OK on success


- `POST /logistic` - All user create logistic


  {

  "itemname" : "phone", 
  "itemprice" : 2000000, 
  "itemweight" : 2,
  "itemquantity": 3

}

* Response: 200 OK on success  "Logistic created successfully".

- `GET /logistic` - All user retrieved logistic

* Response: 200 OK on success "Logistics retrieved successfully".

- `GET /logistic/:id` - Admin Get logistic by id

* Response: 200 OK on success "Logistics retrieved successfully".

* Response: 404 Not Found Error.

* Response: 403 Forbidden.

- `DELETE /logistic/:id` - Carrier delete logistic by id

* Response: 200 OK on success "Logistic deleted successfully".

* Response: 404 Not Found Error.

* Response: 403 Forbidden.

- `UPDATE /logistic/:id` - Shipper Get logistic by id

* Response: 200 OK on success "Logistics updated successfully".

* Response: 404 Not Found Error.

* Response: 403 Forbidden.

