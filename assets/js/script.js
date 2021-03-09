var input = document.querySelector("#input");
var searchBtn = document.querySelector("#search");
var stockInfo = document.querySelector("#stock-info");

var newsContent = document.getElementById("content");

var clearLocalHistoryBtn = document.querySelector("#clear-history-btn");
var historyElement = document.getElementById("search-history");

var financeApiKey = "2de27e6d68mshc925b4db1c6ffd4p149673jsn497cb6662b48";

var toggle = document.querySelector("#nav-toggle");
var menu = document.querySelector("#nav-menu");
var moreBtn = document.querySelector("#nav-more");
var moreDropdown = document.querySelector("#nav-dropdown");

var stockSymbolArray = ["GME", "FB", "AAPL", "GE", "F", "BAC", "AMD", "MSFT", "SPCE", "GOOG"];
var stockSymbol;

toggle.addEventListener("click", function () {
    // If the menu is showing
    if (menu.classList.contains("is-active")) {
        menu.classList.remove("is-active");
        toggle.classList.remove("is-active has-background-dark");
    } else {
        // if the menu is not showing
        menu.classList.add("is-active");
        toggle.classList.add("is-active has-background-dark");
    }
})

moreBtn.addEventListener("click", function () {
    // if the dropdown is not showing
    if (moreDropdown.classList.contains("is-hidden")) {
        moreDropdown.classList.remove("is-hidden");
    } else {
        // if the menu is showing
        moreDropdown.classList.add("is-hidden");
    }
})

getApiRandomNews();

//-------------------------------------link search to articles by symbol or label-------------------------------------------------------------------------------
//-------------------------------------attach .entities[i].label or term----------------------------------------------------------------------------------------

//searches for symbol of stock------------------quoteType and go splice the 2 words so you dont have to search corporation or whatever other word at the end?????????????????
function getApi(symbol) {

    fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=${symbol}&region=US`, {
        "method": "GET",
        "headers": {

            "x-rapidapi-key": `${financeApiKey}`,

            "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Symbol Financials:");
            console.log(data);

            newsContent.innerHTML = "";  


            // Create container for stock articles
            var stockItemEl = document.createElement("article");
            stockItemEl.classList.add("card", "columns", "mt-2", "mb-2");
            //stockItemEl.setAttribute("data-index", i);
            newsContent.appendChild(stockItemEl);

            // Create figure for stock image
            var stockItemImgEl = document.createElement("figure");
            stockItemImgEl.classList.add("column", "is-3", "image", "is-align-content-center");
            stockItemEl.appendChild(stockItemImgEl);

            // Add stock image to figure
            var stockLogo = document.createElement("img");

            stockLogo.setAttribute("src", `https://logo.uplead.com/${data.summaryProfile.website.split("http://www.")[1]}`);
            stockItemImgEl.append(stockLogo);

            // Add container for stock info
            var stockInfoEl = document.createElement("div");
            stockInfoEl.setAttribute("class", "column is-9");
            stockItemEl.append(stockInfoEl);

            // Add symbol full name 
            var fullSymbolName = document.createElement("p");
            fullSymbolName.setAttribute("class", "title");
            fullSymbolName.textContent = `${data.quoteType.longName} (${data.symbol})`;
            stockInfoEl.appendChild(fullSymbolName);

            // Add stock price
            var price = document.createElement("p");
            price.textContent = `Price: ${data.price.regularMarketPrice.fmt}`;
            stockInfoEl.appendChild(price);

            // Add 52 week high
            var fifty2WeekHigh = document.createElement("p");
            fifty2WeekHigh.textContent = `52 High: ${data.summaryDetail.fiftyTwoWeekHigh.raw}`;
            stockInfoEl.appendChild(fifty2WeekHigh);

            // Add 52 week low
            var fifty2WeekLow = document.createElement("p");
            fifty2WeekLow.textContent = `52 Low: ${data.summaryDetail.fiftyTwoWeekLow.raw}`;
            stockInfoEl.appendChild(fifty2WeekLow);

            // Add link to yahoo - specific to given symbol
            var linkToYahoo = document.createElement("a");
            linkToYahoo.setAttribute("href", `https://finance.yahoo.com/quote/${data.symbol}`);
            linkToYahoo.setAttribute("target", "_blank");
            linkToYahoo.setAttribute("class", "mb-6");
            linkToYahoo.textContent = "Link to Yahoo: " + data.symbol;
            stockInfoEl.appendChild(linkToYahoo);

            var symbolSummary = document.createElement("p");
            symbolSummary.textContent = `${data.summaryProfile.longBusinessSummary}`
            stockInfoEl.appendChild(symbolSummary);
                
            // Add symbol to front of history list
            stockSymbolArray.unshift(data.symbol);
            stockSymbolArray.pop();
            console.log(stockSymbolArray);  

            // Store history list locally          
            localStorage.setItem("stock-history", JSON.stringify(stockSymbolArray));

            // Render the history list on the page
            renderStockHistory();
            apiSymbolArticle(symbol);
            
        })

    }

// This gets articles from Yahoo Finance relevant to the symbol searched and displays 5 articles
function apiSymbolArticle(symbolArt) {
    fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-news?category=${symbolArt}&region=US`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": `${financeApiKey}`,
            "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Specific Symbol News:")
            console.log(data);
            


            var newsContainerTitle = document.createElement("p");
            newsContainerTitle.setAttribute("class", "title mt-3");
            newsContainerTitle.textContent = "Relevant Yahoo Finance Articles";
            newsContent.appendChild(newsContainerTitle);

            for (var i = 0; i < 5; i++) {

                // Create container for news articles
                var newsItemEl = document.createElement("article");
                newsItemEl.classList.add("card", "columns", "mt-2", "mb-2");
                newsItemEl.setAttribute("data-index", i);
                newsContent.appendChild(newsItemEl);


                // Create figure for news image
                var newsItemImgEl = document.createElement("figure");
                newsItemImgEl.classList.add("column", "is-3", "image");
                newsItemEl.appendChild(newsItemImgEl);

                // Add news image to figure container
                var newsImg = document.createElement("img");
                if (data.items.result[i].main_image === null) {
                    newsImg.setAttribute("alt", "News Anchor");
                    newsImg.src = "https://image.shutterstock.com/image-vector/news-anchor-on-tv-breaking-260nw-442698565.jpg";
                } else {
                    newsImg.setAttribute("alt", "Add image alt Text reference")
                    newsImg.src = data.items.result[i].main_image.original_url;
                }

                newsItemImgEl.appendChild(newsImg);

                // Add Container for Title and Subtitle after Figure
                var newsItemContent = document.createElement("div");
                newsItemContent.setAttribute("class", "column is-9");
                newsItemEl.append(newsItemContent);

                // Add Title and Subtitle to specific news container
                var newsItemTitle = document.createElement("p");
                newsItemTitle.setAttribute("class", "title");
                newsItemTitle.textContent = data.items.result[i].title;
                newsItemContent.appendChild(newsItemTitle);

                var newsItemSubtitle = document.createElement("p");
                newsItemSubtitle.setAttribute("class", "subtitle ml-3");
                if (data.items.result[i].author = " ") {
                    newsItemSubtitle.textContent = data.items.result[i].publisher;
                } else {
                    newsItemSubtitle.textContent = data.items.result[i].author;
                }
                newsItemContent.appendChild(newsItemSubtitle);
            }
            getRedditApi(symbolArt);
        })
    }

// This gets 5 posts from reddit relevant to the symbol searched and renders underneath the yahoo finance articles
function getRedditApi(symbolSearch) {
    fetch(`https://api.pushshift.io/reddit/submission/search?q=${symbolSearch}&subreddit=investing`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Reddit Posts:")
            console.log(data);
            
            var newsContainerTitle = document.createElement("p");
            newsContainerTitle.setAttribute("class", "title");
            newsContainerTitle.textContent = "Relevant Reddit Posts on r/investing";
            newsContent.appendChild(newsContainerTitle);

            var redditPostContainer = document.createElement("div");
            newsContent.appendChild(redditPostContainer);

            for (var i = 0; i < 5; i++) {

                

                // Create container for news articles
                var newsItemEl = document.createElement("article");
                newsItemEl.classList.add("card", "columns", "mt-2", "mb-2");
                newsItemEl.setAttribute("data-index", i);
                redditPostContainer.appendChild(newsItemEl);

                // Create figure to hold image
                var newsItemImgEl = document.createElement("figure");
                newsItemImgEl.classList.add("column", "is-2", "image");
                newsItemEl.appendChild(newsItemImgEl);

                // Append reddit logo to figure
                var newsImg = document.createElement("img");
                newsImg.setAttribute("alt", "Reddit Logo");
                //newsImg.setAttribute("class", "is-128x128");
                newsImg.src = "https://image.flaticon.com/icons/png/512/52/52053.png";
                newsItemImgEl.appendChild(newsImg);

                //Add Container for Title
                var redditTitleEl = document.createElement("div");
                redditTitleEl.setAttribute("class", "column is-10 is-flex is-align-items-center");
                newsItemEl.append(redditTitleEl);

                // Add Title to specific news container that is hyperlink
                var newsItemTitle = document.createElement("a");
                newsItemTitle.setAttribute("class", "title has-text-link");
                newsItemTitle.setAttribute("href", data.data[i].full_link);
                newsItemTitle.setAttribute("target", "_blank");
                newsItemTitle.textContent = data.data[i].title;
                redditTitleEl.appendChild(newsItemTitle);

                /*
                //Add container for author
                var redditAuthorEl = document.createElement("div");
                redditAuthorEl.setAttribute("class", "column");
                newsItemEl.append(redditAuthorEl);

                var newsItemSubtitle = document.createElement("p");
                newsItemSubtitle.setAttribute("class", "subtitle ml-3");
                newsItemSubtitle.textContent = `${data.data[i].selftext}`;
                redditAuthorEl.appendChild(newsItemSubtitle);
                */
            }
            
        })
}


//gets random stock news and automatically appears on page------------------------
function getApiRandomNews() {
    fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/list?category=generalnews&region=US`, {

        "method": "GET",
        "headers": {
            "x-rapidapi-key": `${financeApiKey}`,
            "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
        }
    })

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Random News:")
            console.log(data);

            var newsContainerTitle = document.createElement("p");
            newsContainerTitle.setAttribute("class", "title mt-3");
            newsContainerTitle.textContent = "General Stock News";
            newsContent.appendChild(newsContainerTitle);

            for (var i = 0; i < data.items.result.length; i++) {

                // Create container for news articles
                var newsItemEl = document.createElement("article");
                newsItemEl.classList.add("card", "columns", "mt-2", "mb-2");
                newsItemEl.setAttribute("data-index", i);
                newsContent.appendChild(newsItemEl);

                // Create figure for news image
                var newsItemImgEl = document.createElement("figure");
                newsItemImgEl.classList.add("column", "is-3", "image");
                newsItemEl.appendChild(newsItemImgEl);

                // Add news image to figure
                var newsImg = document.createElement("img");
                if (data.items.result[i].main_image === null) {
                    newsImg.setAttribute("alt", "News Anchor");
                    newsImg.src = "https://image.shutterstock.com/image-vector/news-anchor-on-tv-breaking-260nw-442698565.jpg";
                } else {
                    newsImg.setAttribute("alt", "Add image alt Text reference")
                    newsImg.src = data.items.result[i].main_image.original_url;
                }

                newsItemImgEl.appendChild(newsImg);

                // Add Container for Title and Subtitle after Figure
                var newsItemContent = document.createElement("div");
                newsItemContent.setAttribute("class", "column is-9");
                newsItemEl.append(newsItemContent);

                // Add Title and Subtitle to specific news container
                var newsItemTitle = document.createElement("p");
                newsItemTitle.setAttribute("class", "title");
                newsItemTitle.textContent = data.items.result[i].title;
                newsItemContent.appendChild(newsItemTitle);

                var newsItemSubtitle = document.createElement("p");
                newsItemSubtitle.setAttribute("class", "subtitle ml-3");
                if (data.items.result[i].author = " ") {
                    newsItemSubtitle.textContent = data.items.result[i].publisher;
                } else {
                    newsItemSubtitle.textContent = data.items.result[i].author;
                }
                newsItemContent.appendChild(newsItemSubtitle);

                // Add a show more button to reveal the article in a modal 
                var showMoreButton = document.createElement("button");
                showMoreButton.textContent = "Read Article";
                showMoreButton.setAttribute("class", "button");
                showMoreButton.setAttribute('id', 'show-more-' + i);
                newsItemContent.appendChild(showMoreButton);
                

                var modalBody = document.querySelector(".modal-card-body");

                //Show more button handler
                showMoreButton.addEventListener("click", function (event) {
                    modalBody.innerHTML = "";
                    var idIndex = parseInt(event.target.getAttribute('id').split("-")[2]);

                    var infoCard = document.createElement("div");
                    infoCard.classList.add("card");
                    
                    var cardContent = document.createElement("div");
                    cardContent.classList.add("card-content");
                    infoCard.appendChild(cardContent);
                    
                    var cardBody = document.createElement("div");
                    cardBody.classList.add("content");
                    cardBody.innerHTML = data.items.result[idIndex].content;
                    cardContent.appendChild(cardBody);
                    
                    modalBody.append(infoCard);



                    document.querySelector(".modal").classList.add("is-active");        
                })

            }
                
                

                var cancelButton = document.querySelector("#cancel-button");

                cancelButton.addEventListener("click", function (event) {
                    document.querySelector(".modal").classList.remove("is-active");

                })
            })
        }

function renderStockHistory() {
    //searchHistoryEl.empty();

    for (var i = 0; i < stockSymbolArray.length; i++) {
        var searchHistoryEl = document.getElementById(`history-${i}`);
        searchHistoryEl.textContent = stockSymbolArray[i];
        searchHistoryEl.setAttribute("data-index", i);
    }
}

var stockContainer = document.querySelector("#stock-container");
searchBtn.addEventListener("click", searchClickHandler);


function searchClickHandler(event) {
    event.preventDefault();
    var searchStock = input.value;
    //articleContent.classList.add("hide");

    if (searchStock === "") {
        return;
    }

    input.value = "";
    getApi(searchStock);
}

// Clear local storage button functionality 
function clearHistory() {
    localStorage.clear();
    stockSymbolArray = ["GME", "FB", "AAPL", "GE", "F", "BAC", "AMD", "MSFT", "SPCE", "GOOG"];
    renderStockHistory();
}

// Make history buttons run the getAPI function for given symbol
function getHistoryItemInfo(event) {

    var element = event.target;
    console.log(element);    

    if (element.matches("button") === true) {
        var historyIndex = element.getAttribute("data-index");
        historySymbol = stockSymbolArray[historyIndex];        
        
        getApi(historySymbol);
    }

    
}

function init() {

    // get symbols from local storage
    var storedStockSymbols = JSON.parse(localStorage.getItem("stock-history"));

    // if local storage not empty
    if (storedStockSymbols !== null) {
        stockSymbolArray = storedStockSymbols;
    }

    // then render the history
    renderStockHistory();
}

init();


clearLocalHistoryBtn.addEventListener("click", clearHistory);

historyElement.addEventListener("click", getHistoryItemInfo);