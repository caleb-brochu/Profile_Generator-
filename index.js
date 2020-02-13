const inquirer = require('inquirer');
const axios = require('axios');
const genHtml = require('./html_gen')
const puppeteer = require('puppeteer');
const fs = require('fs-extra')

const questions = [
    {
        type: 'list',
        message: 'What is your favorit color?',
        name: 'color',
        choices: [
            'red',
            'green',
            'blue',
            'pink'
        ]
    },
    {
        type: 'input',
        message: 'Enter a GitHub user name.',
        name: 'username'
    }
];

async function writeToFile(fileName, data) {
       //console.log(data);
            try{
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                debugger
                await page.setContent(data);
                await page.emulateMedia('screen');
                await page.setViewport({
                    width: 1920,
                    height: 1080
                })
                await page.pdf({
                    path: `${fileName}.pdf`,
                    format: 'A4',
                    printBackground: true
                });
                console.log('done')
                await browser.close
                process.exit();
            }
            catch(err){
                console.log(err);
            }
    }



function init() {

    inquirer.prompt(questions)
    .then(function(res) {

        const favcolor = res.color;
        const username = res.username;
        const queryUrl = `https://api.github.com/users/${username}`;

        axios.get(queryUrl)
            .then(function(res) {
                const user = res.data;
                return user
            })
            .then(function(user){
    
                const profile = {
                    name: user.name,
                    picture: user.avatar_url,
                    color: favcolor,
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
                    const place = profile.location.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(' ','+').toLowerCase();
                    profile.locationURL = `https://www.google.com/maps/search/?api=1&query=${place}`;
                    console.log(profile.locationURL);
                    return profile;
                })
                .then(function(profile){
                    
                    const html = genHtml(profile);
                    const file = profile.name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(' ','_');
                    writeToFile(`${file}_GitHub`, html);
                    //console.log(profile);
                    
                })
                .catch(function(err) {
                    console.log(err);
                });
            })
        })
        
  }
init();
