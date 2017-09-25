// ==UserScript==
// @name         uWaterloo Quest GPA Calculator
// @author       Kevin Thai
// @namespace    https://aruu.github.io/
// @description  Calculate the GPA from the unofficial transcript on Quest, including select which terms to include
// @updateURL    https://github.com/aruu/userscripts/raw/master/quest-gpa.user.js
// @include      https://quest.pecs.uwaterloo.ca/ps*/SS/ACADEMIC/SA/c/*
// @grant        none
// @version      0.6
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes("https://quest.pecs.uwaterloo.ca/psp/SS/ACADEMIC/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL")) {
        var logo = window.document.getElementById("pthdr2logoswan");
        logo.style.backgroundImage = "url(https://aruu-b21e7.firebaseapp.com/assets/title.png)";
    }

    if (window.location.href.includes("https://quest.pecs.uwaterloo.ca/psc/SS/ACADEMIC/SA/c/SA_LEARNER_SERVICES.SS_AA_REPORT1.GBL")) {

        // Constructing the elements + styles
        var sidebar = "<div id='aruu-sidebar' class='PSTEXT'>"+
            "<h3 class='PATRANSACTIONTITLE'>GPA Calculator</h3>"+
            "<div id='gpa-box' class='PSGROUPBOXWBO'>"+
            "<div class='PSLEVEL2GRIDLABEL'>Cumulative GPA</div>"+
            "<div class='PSLONGEDITBOX'>XX</div>"+
            "</div>"+
            "<button id='calculate-gpa' class='SSSBUTTON_ACTIONLINK'>calculate</button>"+
            "<textarea id='testarea' rows='5' cols='10'></textarea>"+
            "<p class='select-text'>Include these terms in calculation:</p>"+
            "<table id='term-table' class='PSEDITBOX_DISPONLY'>"+
            "<tr><td><input type='checkbox' name='terms' id='test'><label for='test'>Term</label></td></tr>"+
            "</table>"+
            "</div>";
        var css = "<style>"+
            "#aruu-sidebar{height:300px;width:150px;top:0px;right:50px;border-color:red;position:fixed;text-align:center;}"+
            "#gpa-box{margin:10px 15px;}"+
            "#calculate-gpa{margin:auto;width:80px;padding:0;border-right-width:2px;}"+
            ".select-text{text-align:left;margin:15px 15px 0 15px;}"+
            "#term-table{margin:0 15px 15px 15px;}"+
            "</style>";

        // Inserting them into the document
        window.document.body.insertAdjacentHTML('beforeend', sidebar);
        window.document.body.insertAdjacentHTML('beforeend', css);
        window.document.getElementById("calculate-gpa").onclick = calculateGPA;
    }

})();

function calculateGPA() {
    var i, j;
    var transcriptDiv = window.document.getElementById("PrintTranscript");
    var testarea = window.document.getElementById("testarea");

    // Filter out the relevant lines of text from the transcript
    var transcript_raw = [];
    if (!transcriptDiv) {
        alert("No transcript on the screen yet!");
        transcript_raw = testarea.value.split("\n");
    } else {
        var text = transcriptDiv.innerHTML;
        text = text.split("<br>");
        for (i=0; i<text.length; i++) {
            if (/^<b>(Fall|Winter|Spring)/.exec(text[i])) transcript_raw.push(text[i]);
            if ("Y" === text[i].slice(70,71)) transcript_raw.push(text[i]);
        }
        testarea.value = transcript_raw.join("\n");
    }

    // Parse the filtered lines into a data structure to store the term names and grades
    var transcript = [];
    var term = {desc:"", courses:[]};
    for (i=0; i<transcript_raw.length; i++) {
        if (result = /^<b>(\w* \d{4})\s*(\d\w)/.exec(transcript_raw[i])) {
            // Row indicating new term
            if (0 !== i) {
                if (term.courses.length > 0) transcript.push(term);
                term = {desc:"", courses:[]};
            }
            var coop = "";
            if (transcript_raw[i].includes("Co-op Work")) coop = " CO-OP";
            term.desc =  result[2] + coop + " (" + result[1] + ")";

        } else {
            // Row containing a course and a grade
            result = /^(.{12}).{29}(.{4}).{8}(.{2})/.exec(transcript_raw[i]);
            var course = {course_code:result[1].trim(),
                         grade:parseFloat(result[3]),
                         weight:parseFloat(result[2])};
            term.courses.push(course);
        }
    }
    transcript.push(term);

    // Take the transcript and calculate the cumulative GPA
    var gpa = 0, gpa_weight = 0;
    for (i=0; i<transcript.length; i++) {
        for (j=0; j<transcript[i].courses.length; j++) {
            gpa += transcript[i].courses[j].grade * transcript[i].courses[j].weight;
            gpa_weight += transcript[i].courses[j].weight;
        }
    }
    gpa /= gpa_weight;

    console.log(transcript);
    console.log(gpa);
}
