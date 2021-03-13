# Stock Search Application

Our first [group project](https://github.com/naisthorpe/crypto-stock-app) on Github.

## Introduction

Stock app allows you to search any stock symbol and view the stock's information, Yahoo Finance articles relevant to the stock, and Reddit posts from r/investing that mention the stock.

## Installation  

As a user types in the abbreviation of a stock, a short description of the latest events, price and picture of the chosen symbol will be displayed. 
A list of matched news options will appear as buttons on the page. When a button is clicked on, a new page will show certain details.
The home page based on Yahoo Finance and (Reddit?) Api will show the newest articles. User would be able to click on read button to see the full event.
The menu have reference to Reddit, Bitcoin chart and yahoo finance web pages, also user can repot the issue if something not working properly or news does not fit the topic.

Please visit the deployed project at: https://naisthorpe.github.io/crypto-stock-app/ or click the icon on the left top side of the page to be referred to GitHub repository.

## Technologies

- Yahoo Finance API is used to retrieve matching news options & stock data for type of user's choice;
-  UpLead generates a logo based on user's input;  
-  Page was built with Bulma framework, CSS adds responsive modules that are used to create Web Design;   

## User Story
```
AS a casual promising investor 
I WANT to research trending reddit stocks 
SO THAT can view stock/crypto/reddit information on one page

GIVEN a stock/crypto application
WHEN I search for a stock
THEN I see a chart for that stock and relevant reddit posts
AND THEN I can see my search history in the search panel
WHEN I press the home link
THEN the page refreshes
WHEN I click an article link
THEN I am taken to that site in a new tab
WHEN I click the read article button 
THEN page displayed me last topic for the certain article
```


## Site Screenshot

![Site Screenshot](assets/images/site-screenshot.gif)

## Sources

- Yahoo finance API https://rapidapi.com/apidojo/api/yahoo-finance1
- Reddit API https://pushshift.io/api-parameters/

## Additional:
- Logo for Reddit Stock App https://www.uplead.com/
