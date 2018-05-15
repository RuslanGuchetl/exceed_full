import React from "react";

export const Compare = () => {
  let userLogin = document.getElementById('username');
  let userPw = document.getElementById('userpass');
  let l = userLogin.value;
  let p = userPw.value;

  if (l.length < 4) {
    userLogin.setCustomValidity('Login too short! Min 4 char');
  }
  if (l.length > 20) {
    userLogin.setCustomValidity('Password too long! Max 20 char');
  }
  if ((l.length >= 4) && (l.length <= 20)) {
    userLogin.setCustomValidity('');
  }
  if (p.length < 6) {
    userPw.setCustomValidity('Password too short! Min 6 char');
  }
  if (p.length > 35) {
    userPw.setCustomValidity('Password too long! Max 35 char');
  }
  if ((p.length >= 6) && (p.length <= 35)) {
    userPw.setCustomValidity('');
  }

  if (l.length >= 4 && l.length <= 20) {
    if (p.length >= 6 && p.length <= 35) {
      userLogin.setCustomValidity('');
      userPw.setCustomValidity('');
    }
  }
};