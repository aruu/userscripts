// ==UserScript==
// @name         uWaterloo Quest GPA Calculator
// @author       Kevin Thai
// @namespace    https://aruu.github.io/
// @description  Calculate the GPA from the unofficial transcript on Quest, including select which terms to include
// @updateURL    https://github.com/aruu/userscripts/raw/master/quest-gpa.user.js
// @include      https://quest.pecs.uwaterloo.ca/ps*/SS/ACADEMIC/SA/c/*
// @grant        none
// @version      0.65
// ==/UserScript==

var terms = [];

(function() {
    'use strict';

    if (window.location.href.includes("https://quest.pecs.uwaterloo.ca/psp/SS/ACADEMIC/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL")) {
        let logo = window.document.getElementById("pthdr2logoswan");
        logo.style.backgroundImage = "url(https://aruu-b21e7.firebaseapp.com/assets/title.png)";
    }

    if (window.location.href.includes("https://quest.pecs.uwaterloo.ca/psc/SS/ACADEMIC/SA/c/SA_LEARNER_SERVICES.SS_AA_REPORT1.GBL")) {

        // Constructing the elements + styles
        let sidebar = "<div class='aruu-sidebar PSTEXT'>"+
            "<h3 class='PATRANSACTIONTITLE'>GPA Calculator</h3>"+
            "<div class='gpa-container PSGROUPBOXWBO'>"+
            "<div class='PSLEVEL2GRIDLABEL'>Cumulative GPA</div>"+
            "<div class='PSLONGEDITBOX' id='gpa-box'>XX</div>"+
            "</div>"+
            "<button id='read-transcript' class='sidebar-button SSSBUTTON_ACTIONLINK'>1. read transcript</button>"+
            "<button id='calculate-gpa' class='sidebar-button SSSBUTTON_ACTIONLINK'>2. calculate</button>"+
            "<textarea id='testarea' rows='5' cols='10'></textarea>"+
            "<form id='term-selection'>"+
            "<p class='select-text'>Include these terms in calculation (click calculate to update GPA):</p>"+
            "<table class='term-table PSEDITBOX_DISPONLY'>"+
            "<tbody id='term-table-body'>"+
            "</tbody>"+
            "</table>"+
            "</form>"+
            "</div>";
        let css = "<style>"+
            ".aruu-sidebar{max-height:500px;width:220px;top:10px;right:50px;position:fixed;text-align:center;"+
            "border:1px solid #7573BE;border-radius:7px;overflow:auto;}"+
            ".gpa-container{margin:10px auto; width:120px;}"+
            ".sidebar-button{margin:3px auto;width:120px;padding:0;border-right-width:2px;}"+
            ".sidebar-button:hover{border-right-width:2px;}"+
            ".select-text{text-align:left;margin:15px 15px 0 15px;}"+
            ".term-table{margin:0 15px 15px 15px;}"+
            "</style>";

        // Inserting them into the document
        window.document.body.insertAdjacentHTML('beforeend', sidebar);
        window.document.body.insertAdjacentHTML('beforeend', css);
        window.document.getElementById("read-transcript").onclick = readTranscript;
        window.document.getElementById("calculate-gpa").onclick = calculateGPA;
    }

})();

function readTranscript() {
    var transcriptDiv = window.document.getElementById("PrintTranscript"),
        testarea = window.document.getElementById("testarea");

    // Filter out the relevant lines of text from the transcript
    var transcript_raw = [];
    if (!transcriptDiv) {
        alert("No transcript on the screen yet!");
        transcript_raw = testarea.value.split("\n");
    } else {
        let text = transcriptDiv.innerHTML;
        text = text.split("<br>");
        for (i=0; i<text.length; i++) {
            if (/^<b>(Fall|Winter|Spring)/.exec(text[i])) transcript_raw.push(text[i]);
            if ("Y" === text[i].slice(70,71)) transcript_raw.push(text[i]);
        }
        testarea.value = transcript_raw.join("\n");
    }

    // Parse the filtered lines into a data structure to store the term names and grades
    terms = [];
    var term = {desc:"", courses:[]};
    for (let i=0; i<transcript_raw.length; i++) {
        if (result = /^<b>(\w* \d{4})\s*(\d\w)/.exec(transcript_raw[i])) {
            // Row indicating new term
            if (0 !== i) {
                if (term.courses.length > 0) terms.push(term);
                term = {desc:"", courses:[]};
            }
            let coop = "";
            if (transcript_raw[i].includes("Co-op Work")) coop = " CO-OP";
            term.desc =  result[2] + coop + " (" + result[1] + ")";

        } else {
            // Row containing a course and a grade
            result = /^(.{12}).{29}(.{4}).{8}(.{2})/.exec(transcript_raw[i]);
            let course = {course_code:result[1].trim(),
                         grade:parseFloat(result[3]),
                         weight:parseFloat(result[2])};
            term.courses.push(course);
        }
    }
    terms.push(term);

    // Clear the list of terms first
    window.document.getElementById("term-table-body").innerHTML = "";
    // Get term names and create checkbox controls to select terms included
    for (let i=0; i<terms.length; i++) {
        let checkbox = "<tr><td><input type='checkbox' id='term" + i + "' checked>"+
            "<label for='term" + i + "'>"+
            terms[i].desc + "</label></td></tr>";
        window.document.getElementById("term-table-body").insertAdjacentHTML('beforeend', checkbox);
    }
}

function calculateGPA() {
    // Take the transcript and calculate the cumulative GPA
    var gpa = 0, gpa_weight = 0;
    for (let i=0; i<terms.length; i++) {
        if (!window.document.forms["term-selection"].elements["term"+i].checked) continue;
        for (let j=0; j<terms[i].courses.length; j++) {
            gpa += terms[i].courses[j].grade * terms[i].courses[j].weight;
            gpa_weight += terms[i].courses[j].weight;
        }
    }
    gpa /= gpa_weight;
    console.log(gpa);
    window.document.getElementById("gpa-box").innerHTML = gpa.toFixed(2);
}
