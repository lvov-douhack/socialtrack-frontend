//Copyright (c) 2012  #douhack
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
  var currentState = $.storage.get('currentState');
  UpdateLayout(currentState);  
}

function UpdateLayout(currentState){
  if(currentState == null){
    $.storage.set('currentState', 'configToken');
    OpenLink('http://172.24.222.27:3000/users/sign_up');
    $('#configForm').css('display', 'none');
    window.close();

  } else if (currentState == 'configToken'){
    $('#configForm').css('display', 'block');

  } else if (currentState == 'readyToUse') {
    $('#configForm').css('display', 'none');
    $('#rtu').val('READY');
  }
}

function SaveToken(){
  if($.storage.get('currentState') == 'configToken'){
    var token = $('#token').val();
    if(token !== ''){
     $.storage.set('token', token);
     UpdateStatus('readyToUse');
    }
  }
}

$(function(){
  
});

function UpdateStatus(newStatus){
  $.storage.set('currentState', 'readyToUse');
  UpdateLayout(newStatus);
}

document.addEventListener('DOMContentLoaded', function () {
  SelectLayout();
  $('#setTokenBtn').bind('click', function() {
    SaveToken();
  });
});