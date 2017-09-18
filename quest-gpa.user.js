// ==UserScript==
// @name         uWaterloo Quest GPA Calculator
// @author       Kevin Thai
// @namespace    https://aruu.github.io/
// @description  Calculate the GPA from the unofficial transcript on Quest, including select which terms to include
// @updateURL    https://github.com/aruu/userscripts/raw/master/quest-gpa.user.js
// @include      https://quest.pecs.uwaterloo.ca/ps*/SS/ACADEMIC/SA/c/*
// @grant        none
// @version      0.55
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes("https://quest.pecs.uwaterloo.ca/psp/SS/ACADEMIC/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL")) {
        var logo = window.document.getElementById("pthdr2logoswan");
        logo.style.backgroundImage = "url(https://aruu-b21e7.firebaseapp.com/assets/title.png)";
    }

    if (window.location.href.includes("https://quest.pecs.uwaterloo.ca/psc/SS/ACADEMIC/SA/c/SA_LEARNER_SERVICES.SS_AA_REPORT1.GBL")) {

        // Constructing the elements + styles
        var sidebar = "<div id='aruu-sidebar'>"+
            "<h3 class='PATRANSACTIONTITLE'>GPA Calculator</h3>"+
            "<button id='calculateGPA' class='SSSBUTTON_ACTIONLINK'>Colour area</button>"+
            "</div>";
        var css = "<style>"+
            "#aruu-sidebar{height:300px;width:150px;top:0px;right:50px;border-color:red;position:fixed;text-align:center;}"+
            "#calculateGPA{margin:auto;width:80px;padding:0;border-right-width:2px;}"+
            "</style>";

        // Inserting them into the document
        window.document.body.insertAdjacentHTML('beforeend', sidebar);
        window.document.body.insertAdjacentHTML('beforeend', css);
        window.document.getElementById("calculateGPA").onclick = calculateGPA;
    }

})();

function calculateGPA() {
    var test = window.document.getElementById("win0divUW_DERIVED_TS_UW_TRANSCRIPT_TEXT");
    //PrintTranscript
    console.log(test);
    if (test === null) {
        alert("No transcript available to colour yet!");
    } else {
        if (test.style.backgroundColor == "blue") {
            test.style.backgroundColor = "white";
        } else {
            test.style.backgroundColor = "blue";
        }
    }
}
