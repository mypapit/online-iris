//Lite Date Handling by Mohammad Hafiz Ismail <mypapit@gmail.com>
// Copyright (c) 2022 Mohammad Hafiz bin Ismail

const ddate = document.getElementById("ddate");
const yyear = document.getElementById("yyear");

function getMD() {
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const d = new Date();
let name = month[d.getMonth()];

var dd = String(d.getDate()).padStart(2, '0');

//return (name + " " + dd);

ddate.innerHTML = name + " " + dd;
}

function getYear() {
 year= new Date().getFullYear();

 yyear.innerHTML=year;




}

getMD();
getYear();
