import React from "react";

export const validateAll = () => {
  let userLogin = document.getElementById('login');
  let userPw = document.getElementById('password');
  let confPw = document.getElementById("confirmPassword");
  let userMail = document.getElementById('email');

  if (!userLogin.value.match(/^[a-z0-9_-]{4,20}$/)) {
    userLogin.setCustomValidity("Try another login");
  } else {
    userLogin.setCustomValidity('');
  }
  if (userPw.value != confPw.value) {
    confPw.setCustomValidity("Passwords Don't Match");
  } else {
    confPw.setCustomValidity('');
  }
  if (!(userMail.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))) {
    userMail.setCustomValidity("Not valid Email!");
  } else {
    userMail.setCustomValidity('');
  }
};