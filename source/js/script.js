'use strict';

var burger = document.querySelector('.main-navigation__toggle');
var menu = document.querySelector('.main-navigation__list');
var iconOpen = document.querySelector('.main-navigation__toggle-open');
var iconClose = document.querySelector('.main-navigation__toggle-close');

burger.classList.remove('hidden');
menu.classList.remove('main-navigation__list--nojs');
iconClose.classList.add('hidden');

function burgerClickHandler() {
  menu.classList.toggle('main-navigation__list--nojs');
  iconClose.classList.toggle('hidden');
  iconOpen.classList.toggle('hidden');
}

burger.addEventListener('click', burgerClickHandler);
