const inquirer = require('inquirer');
const fs = require('fs');
const axios = require('axios');

const toPDF = require('pdf-puppeteer');

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
    fs.writeFile()
 
}


function init() {

    inquirer.prompt(questions)
    .then(function({ username , color }) {
        
        const queryUrl = `https://api.github.com/users/${username}`;
        const favcolor = color;
        axios.get(queryUrl)
            .then(function(res) {
                const user = res.data;
                console.log(user)
                return user
            })
            .then(function(user){
    
                const profile = {
                    name: user.name,
                    picture: user.avatar_url,
                    color: color,
                    location: user.location,
                    profileLink: user.html_url,
                    job: user.company,
                    blog: user.blog,
                    followers: user.followers,
                    following: user.following,
                    repos: user.public_repos,
                    bio: user.bio,
                    starsUrl: user.starred_url,
                    stars: ''
                }
                
                profile.starsUrl = profile.starsUrl.replace("{/owner}{/repo}",'')
                return profile;
            })
            .then(function(profile){
                axios.get(profile.starsUrl)
                .then(function(res){
                    const stars = res.data.length;
                    profile.stars = stars;
                    return profile;
                })
                
                .then(function(profile){
                    
                    const place = profile.location.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(' ','+').toLowerCase();
                    profile.locationURL = `https://www.google.com/maps/search/?api=1&query=${place}`
                    return profile;
                })
                .then(function(profile){
                    //writeToFile("make.pdf", profile)
                    return module.exports.user_info = profile;
                    
                })
                .then(function(){
                    const genHtml = require('./html_gen');
                })
            })
        })
        
  }


init();
