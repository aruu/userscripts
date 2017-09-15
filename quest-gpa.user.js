// ==UserScript==
// @name         uWaterloo Quest GPA Calculator
// @author       Kevin Thai
// @namespace    https://aruu.github.io/
// @description  Calculate the GPA from the unofficial transcript on Quest, including select which terms to include
// @updateURL    https://github.com/aruu/userscripts/raw/master/quest-gpa.user.js
// @include      https://quest.pecs.uwaterloo.ca/psp/SS/ACADEMIC/SA/c/*
// @grant        none
// @version      0.5
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href === ("https://quest.pecs.uwaterloo.ca/psp/SS/ACADEMIC/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL"+
                                  "?PORTALPARAM_PTCNAV=HC_SSS_STUDENT_CENTER&EOPP.SCNode=SA&EOPP.SCPortal=ACADEMIC"+
                                  "&EOPP.SCName=CO_EMPLOYEE_SELF_SERVICE&EOPP.SCLabel=Self%20Service&EOPP.SCPTfname=CO_EMPLOYEE_SELF_SERVICE"+
                                  "&FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HC_SSS_STUDENT_CENTER&IsFolder=false")) {
        var logo = window.document.getElementById("pthdr2logoswan");
        logo.style.backgroundImage = "url(https://aruu-b21e7.firebaseapp.com/assets/title.png)";
    }

    if (window.location.href === ("https://quest.pecs.uwaterloo.ca/psc/SS/ACADEMIC/SA/c/SA_LEARNER_SERVICES.SS_AA_REPORT1.GBL"+
                                  "?Page=SS_ES_AARPT_TYPE2&Action=A&TargetFrameName=None")) {

        var sidebar = "<div id='aruu-sidebar'"+
            "style='height: 300px; width: 150px; top: 0px; right: 50px; "+
            "background-color: red; position: fixed; text-align: center;'>"+
            "<h3>GPA Calculator</h3>"+
            "<button id='calculateGPA'>Calculate</button>"+
            "</div>";

        window.document.body.insertAdjacentHTML('beforeend', sidebar);
        window.document.getElementById("calculateGPA").onclick = fa;
    }

})();

function fa() {
    alert('TESTEST 123');
    var test = window.document.getElementById("win0divUW_DERIVED_TS_UW_TRANSCRIPT_TEXT");
    //PrintTranscript
    console.log(test);
}