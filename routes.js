const express = require("express");
const bodyParser = require("body-parser");

const fs = require('fs');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
        res.sendFile(__dirname + "/index.html");
    })

app.post("/", (req, res) => {
        var fName = req.body.firstName;
        var lName = req.body.lastName;
        var age = req.body.age;
        var occupation1 = req.body.occupation;
        var date = new Date();

        if ((fName.length < 1) || (lName.length  < 1) || (age.length  < 1) ||  (occupation1.length  < 1)){
                res.send("Please fill all fields");
            }  else{
            const spaceHtml = '\r\n<br/>';
            fs.appendFile(__dirname + '/store.txt', spaceHtml, { flag: 'a+' }, (err) => {
                if (err) {
                    console.error(err);
             }
            });
        
            var firstName = capitalizer(fName);
            var lastName = capitalizer(lName);
            var occupation = capitalizer(occupation1);

            var firNam = '\t First Name: ' + firstName + '<br/>';
            var lasNam = '\t Last Name: ' + lastName + '<br/>';
            var trueAge = '\t Age: ' + age + '<br/>';
            var trueOccupation = '\t Occupation: ' + occupation + '<br/>';
            var currentDate = '\t Date and Time of Entry: ' + date + '<br/>';

            var personInfo = [];
            personInfo.push(firNam, lasNam, trueAge, trueOccupation, currentDate);

            for (let i = 0; i < personInfo.length; i++) {
                var content = personInfo[i];
                fs.appendFile(__dirname + '/store.txt', content, { flag: 'a+' }, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        }
})
      
app.get("/store", (req, res) => {
    fs.readFile(__dirname + '/store.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});

app.get("/search", (req, res) => {
        res.sendFile(__dirname + "/search.html");
    })

app.post("/search", (req, res) => {
    var keyWord = req.body.keyWord;
    var wordPicker = keyWord.split(' ');
    console.log(wordPicker);
    if (wordPicker.length !== 2 || wordPicker[0] < 1 || wordPicker[1] < 1) {
        res.send("I TOLD YOU TO PUT 2 VALUES!!!");
    } else{
        var word1 = capitalizer(wordPicker[0]);
        var word2 = capitalizer(wordPicker[1]);
        
        let file = fs.readFileSync(__dirname + '/store.txt', 'utf8');
        let arr = file.split(/\r?\n/);
        arr.forEach((line, idx)=> {
            if(line.includes(word1 && word2)){
                res.send((idx)+':'+ line); 
            } 
        });
    }
})

app.listen(2800, function serverFunc() {
    console.log("This server has started running on port 2800");
})

function capitalizer(gottenNames) {
    var capName = gottenNames.toLowerCase().split(' ');
        for (var i = 0; i < capName.length; i++) {
        capName[i] = capName[i].charAt(0).toUpperCase() + capName[i].substring(1);     
        }
         return capName.join(' '); 
}