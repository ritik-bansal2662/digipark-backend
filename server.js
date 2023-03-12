const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db-connection')
const { response } = require('express')
// const cors = require('cors')
// const fileUpload=require('express-fileupload')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended:true } ))
// app.use(fileUpload());

app.get('/api', (req, res) => {
    // res.json({"users" : ['user1', 'user2', 'user3'] })
    res.sendFile(__dirname+"/test.html")
})


// register user
app.post('/signup', (req, res) => {
    console.log('req body: ', req.body)

    const paramResponse = checkParams(req.body, ['fname', 'email', 'password'])
    console.log('param response: ', paramResponse, '\n');

    var api_response = {
        error: true,
        message: 'API did not run properly.'
    }

    if(paramResponse['error'] === true) {
        // res.send(paramResponse)
        console.log("params not available", paramResponse, '\n');
        api_response.error = true
        api_response.message = 'All Parameters not set'
        api_response.notAvailable = paramResponse['notAvailable']
        console.log('param check',api_response, '\n');

        res.json(api_response)
    } else {
        
        const fname = req.body.fname
        const lname = null
        const email = req.body.email
        const mobile = null
        const pass = req.body.password
        if(req.body.lname !== undefined) {
            const lname = req.body.lname
        }
        if(req.body.mobile !== undefined) {
            const mobile = req.body.mobile
        }

        const sqlCheck = "Select * from users where Email = ? or Mobile = ?"
        db.query(sqlCheck, [email, mobile], (err, result) => {
            if(err) {
                console.log('Unable to check already existing data.',err, '\n')
                // res.json(err)
                api_response.error = true
                api_response.message = 'Unable to check already existing data.'
                // api_response['notAvailable'] = paramResponse['notAvailable']
                console.log('db check error: ',api_response, '\n');

                res.send(api_response)

            } else {
                console.log('db check result: ', result, '\n')
                // res.json([result, result.length])

                if(result.length === 0) {
                    console.log("user already doesnot exists \n");
                    const sqlInsert = `INSERT INTO users (First_name, Last_name, Email, Mobile,Password, Status) 
                        values(?, ?, ?, ?, ?, 'Registered');`
                    db.query(sqlInsert, [fname, lname, email, mobile, pass], (err, result) => {
                        if(err) {
                            console.log('db insertion error',err, '\n')
                            // res.json(err)
                            api_response.error = true
                            api_response.message = 'Error in SQL query or something wrong in Database.'
                            api_response.sqlResponse = err

                            res.send(api_response)
                        } else {
                            console.log(result)
                            // res.json([result, result.length])
                            api_response.error = false
                            api_response.message = 'Successfully registered!'
                            api_response.sqlResponse = result

                            res.send(api_response)
                        }
                    })
                } else {
                    api_response.error = false
                    api_response.message = 'User Already Exists'
                    api_response.sqlResponse = result
                    console.log("User already exists. \n");
                    console.log('user exists',api_response, '\n');

                    res.send(api_response)
                }
            }
        })
    }    
    // console.log('api response: ', api_response);
    // res.send(api_response) 

})



// login user
app.get('/login', (req, res) => {
    console.log('req body: ', req.body)

    const paramResponse = checkParams(req.body, ['email', 'password'])
    console.log('param response: ', paramResponse, '\n');

    var api_response = {
        error: true,
        message: 'API did not run properly.'
    }

    if(paramResponse['error'] === true) {
        // res.send(paramResponse)
        console.log("params not available", paramResponse, '\n');
        api_response.error = true
        api_response.message = 'All Parameters not set'
        api_response.notAvailable = paramResponse['notAvailable']
        console.log('param check',api_response, '\n');
        
        res.json(api_response)
    } else {
        const email = req.body.email
        const pass = req.body.password

        const sqlSelect = "Select * from users where Email = ? and Password = ?"
        db.query(sqlSelect, [email, pass], (err, result) => {
            if(err) {
                console.log('Unable to check data.',err, '\n')
                // res.json(err)
                api_response.error = true
                api_response.message = 'Unable to check data. Cannot login right now.'
                // api_response['notAvailable'] = paramResponse['notAvailable']
                console.log('db check error: ',api_response, '\n');

                res.send(api_response)

            } else {
                console.log('db check result: ', result, '\n')
                // res.json([result, result.length])

                if(result.length === 1) {
                    console.log("user data exists \n");
                    api_response.error = false
                    api_response.message = 'User Data Fetched Successfully!'
                    api_response.sqlResponse = result
                    api_response.first_name = result[0]['First_name']
                    api_response.last_name = result[0]['Last_name']
                    api_response.email = result[0]['Email']
                    api_response.mobile = result[0]['Mobile']
                    api_response.status = result[0]['Status']

                    res.send(api_response)
                } else {
                    api_response.error = true
                    api_response.message = 'User doesnot Exist.'
                    api_response.sqlResponse = result
                    console.log("User doesnot Exist. \n");
                    console.log('user doesnot exists', api_response, '\n');

                    res.send(api_response)
                }
            }
        })
    }

})



// register parking area
app.post('/register-parking-area', (req, res) => {
    console.log('req body: ', req.body)

    const paramResponse = checkParams(req.body, [
        'email', 'name', 'contact_number', 'address_line_1', 'city', 'state', 
        'pincode', 'number_of_slots', 'latitude', 'longitude', 'owner'
    ])
    console.log('param response: ', paramResponse, '\n');

    var api_response = {
        error: true,
        message: 'API did not run properly.'
    }

    if(paramResponse['error'] === true) {
        // res.send(paramResponse)
        console.log("params not available", paramResponse, '\n');
        api_response.error = true
        api_response.message = 'All Parameters not set'
        api_response.notAvailable = paramResponse['notAvailable']
        console.log('param check',api_response, '\n');

        res.json(api_response)
    } else {
        
        const name = req.body.name
        const email = req.body.email
        const contact_number = req.body.contact_number
        const address_line_1 = req.body.address_line_1
        const address_line_2 = null
        const city = req.body.city
        const state = req.body.state
        const pincode = req.body.pincode
        const number_of_slots = req.body.number_of_slots
        const latitude = req.body.latitude
        const longitude = req.body.longitude
        const owner = req.body.owner
        const manager = null

        if(req.body.address_line_2 !== undefined) {
            const address_line_2 = req.body.address_line_2
        }
        if(req.body.manager !== undefined) {
            const manager = req.body.manager
        }

        const sqlCheck = "Select * from parking_areas where Email = ? or Contact_number = ?"
        db.query(sqlCheck, [email, contact_number], (err, result) => {
            if(err) {
                console.log('Unable to check already existing data.',err, '\n')
                // res.json(err)
                api_response.error = true
                api_response.message = 'Unable to check already existing data.'
                // api_response['notAvailable'] = paramResponse['notAvailable']
                console.log('db check error: ',api_response, '\n');

                res.send(api_response)

            } else {
                console.log('db check result: ', result, '\n')
                // res.json([result, result.length])

                if(result.length === 0) {
                    console.log("Details already doesnot exists! \n");
                    const sqlInsert = `INSERT INTO parking_areas (
                            Name, Email, Contact_number, Address_line_1, Address_line_2, City,
                            State, Pincode, Number_of_slots, Latitude,
                            Longitude, Owner, Manager
                        ) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

                    db.query(sqlInsert, [
                            name, email, contact_number, address_line_1, address_line_2, city,
                            state, pincode, number_of_slots, latitude,
                            longitude, owner, manager
                        ], (err, result) => {
                        if(err) {
                            console.log('db insertion error',err, '\n')
                            // res.json(err)
                            api_response.error = true
                            api_response.message = 'Error in SQL query or something wrong in Database.'
                            api_response.sqlResponse = err

                            res.send(api_response)
                        } else {
                            console.log(result)
                            api_response.error = false
                            api_response.message = 'Successfully registered!'
                            api_response.sqlResponse = result

                            res.send(api_response)
                        }
                    })
                } else {
                    api_response.error = true
                    api_response.message = 'Email or Contact information already linked to some account.'
                    api_response.sqlResponse = result

                    console.log("Email or Contact information already linked to some account. \n");
                    console.log('email or contact number exits.', api_response, '\n');

                    res.send(api_response)
                }
            }
        })
    }    
    // console.log('api response: ', api_response);
    // res.send(api_response) 

})


















function checkParams(body, params) {
    console.log(params);
    let response = {}
    let notAvailable = []
    params.forEach(element => {
        if(body[element] === undefined || body[element] === '' || body[element] === ' ') {
            response['error'] = true;
            notAvailable.push(element)
        }
    });
    response['notAvailable'] = notAvailable
    return response
}



app.listen(5000, () => { 
    console.log('\n - - - \n Server started on port 5000. \n - - - \n') 
})
