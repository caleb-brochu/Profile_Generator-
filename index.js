const inquirer = require('inquirer');
const fs = require('fs');
const html_pdf = require('html-pdf');
const axios = require('axios')
const html = require('./html_gen')

const questions = [
    {
        type: 'input',
        message: 'What is your favorit color?',
        name: 'color'
    },
    {
        type: 'input',
        message: 'Enter a GitHub user name.',
        name: 'username'
    }
];

function writeToFile(fileName, data) {
 
}


function init() {

    inquirer.prompt(questions)
    .then(function({ username }) {
        const queryUrl = `https://api.github.com/users/${username}`;
    
        axios.get(queryUrl)
            .then(function(res) {
                const user_info = res.data;
                console.log(user_info)
                const user_login = user_info.login; //ok
                const user_location = user_info.location; // need google maps API
                const user_profile = user_info.html_url; //ok
                const user_blog = user_info.blog; //need to find 
                const user_followers = user_info.followers; //ok
                const user_following = user_info.following; //ok
                const user_repo = user_info.public_repos; //ok
                const user_bio = user_info.bio // ok
                let location = user_location.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(' ','+').toLowerCase();
                let locationURL = `https://www.google.com/maps/search/?api=1&query=${location}`
                console.log(locationURL);
                 axios.get(`https://api.github.com/users/${username}/starred`)
                 .then(function(response){
                    const user_stars = response.data.length
                })
                // .then(function(location){
                //     console.log(location);
                // })
                //console.log ()
                const apiKey = "AIzaSyAgyWn-gduku8UTV6DhTEXWR8V0NHKuo8A"
            
        });
    });
 }


init();
