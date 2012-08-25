﻿//Copyright (c) 2012  #douhack
//authors: wk, G3D, vessi, zasadnyy
//vim: set sw=2 sts=2 ts=8 et syntax=javascript:

//This file depends on JQuery

// wK

function OpenLink(url)
{
    if (typeof(url) !== 'undefined')
        chrome.tabs.create({url: url});
    else    
        throw new Exception('Invalid URL!');
}

function ClosePopup()
{
  window.close();
}

function OpenURLFromElem()
{
  if (event && event.target)
  {
    var url = event.currentTarget.getAttribute("url");
    if (url)
      OpenLink(url);
  }
}

function SelectLayout(){
  var currentState = $.storage.get('runtime.currentState');
  UpdateLayout(currentState);  
}

function UpdateLayout(currentState){
  if(currentState == null){
    $.storage.set('runtime.currentState', 'configToken');
    $('#configForm').css('display', 'none');
    OpenLink('http://172.24.222.27:3000/users/sign_up');
    ClosePopup();

  } else if (currentState == 'configToken'){
    $('#configForm').css('display', 'block');

  } else if (currentState == 'readyToUse') {
    $('#configForm').css('display', 'none');
    $('#content').text('READY');
  }
}

function SaveToken(){
  if($.storage.get('runtime.currentState') == 'configToken'){
    var token = $('#token').val();
    if(token !== ''){
     $.storage.set('token', token);
     UpdateStatus('readyToUse');
     SetDefaultConfig();
    }
  }
}

function UpdateStatus(newStatus){
  $.storage.set('currentState', newStatus);
  UpdateLayout(newStatus);
}

function SetDefaultConfig(){
  var $config = {
     'sites': [
        {'id': 0, 'name': 'VK', 'mask': 'vk.com'},
        {'id': 1, 'name': 'Facebook', 'mask': 'facebook.com'}, 
        {'id': 2, 'name': 'Twitter', 'mask': 'twitter.com'},
        {'id': 3, 'name': 'Habrahabr', 'mask': '(habra)?habr.ru'}
       ],
     'siteRegexp': '/^(\w+:\/\/[^\/]+).*$/',
     'waste_interval': 1000,  
     'API_URL': 'http://172.24.222.27:3000/api/'
   };
   $.storage.set('config', config);
}

$(function() {
 SelectLayout();
  $('#setTokenBtn').bind('click', function() {
    SaveToken();
  });
});