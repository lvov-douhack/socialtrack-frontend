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

$(function(){
  
});