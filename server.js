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
                        } else {
                            console.log(result)
                            // res.json([result, result.length])
                            api_response.error = false
                            api_response.message = 'Successfully registered!'
                            api_response.sqlResponse = result
                        }
                    })
                } else {
                    api_response.error = false
                    api_response.message = 'User Already Exists'
                    api_response.sqlResponse = result
                    console.log("User already exists. \n");
                    console.log('user exists',api_response, '\n');
                }
            }
        })
    }    
    console.log('api response: ', api_response);
    res.send(api_response)    

})

app.post('/login', (req, res) => {
    res.json({
        "name": 'ritik'
    })

})



function checkParams(body, params) {
    console.log(params);
    let response = {}
    let notAvailable = []
    params.forEach(element => {
        if(body[element] === undefined) {
            response['error'] = true;
            notAvailable.push(element)
        }
    });
    response['notAvailable'] = notAvailable
    return response
}



app.listen(5000, () => { console.log('\n - - - \n Server started on port 5000. \n - - - \n') })
