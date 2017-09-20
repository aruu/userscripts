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
    var transcriptDiv = window.document.getElementById("PrintTranscript");
    var testarea = window.document.getElementById("testarea");
    var transcript = [];
    if (!transcriptDiv) {
        alert("No transcript on the screen yet!");
        transcript = testarea.value.split("\n");
    } else {
        var text = transcriptDiv.innerHTML;
        text = text.split("<br>");
        for (var i=0; i<text.length; i++) {
            if (/^<b>(Fall|Winter|Spring)/.exec(text[i])) transcript.push(text[i]);
            if ("Y" === text[i].slice(70,71)) transcript.push(text[i]);
        }
        testarea.value = transcript.join("\n");
    }
    console.log(transcript);

}
