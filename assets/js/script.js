var input = document.querySelector("#input");
var searchBtn = document.querySelector("#search");
var stockInfo = document.querySelector("#stock-info");

var newsContent = document.getElementById("content");

var clearLocalHistoryBtn = document.querySelector("#clear-history-btn");
var historyElement = document.getElementById("search-history");

var financeApiKey = "a4e5e5bec6msh6db86fc928431e7p1bf83cjsn6e2902641519";

var toggle = document.querySelector("#nav-toggle");
var menu = document.querySelector("#nav-menu");
var moreBtn = document.querySelector("#nav-more");
var moreDropdown = document.querySelector("#nav-dropdown");

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

getApiNews();

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

            var stockLogo = document.createElement("img");
            console.log(data.summaryProfile.website.split("http://www."))
            stockLogo.setAttribute("src", `https://logo.uplead.com/${data.summaryProfile.website.split("http://www.")[1]}`);
            stockLogo.setAttribute("width", 100);
            newsContent.append(stockLogo);

            var fullSymbolName = document.createElement("span");
            fullSymbolName.textContent = `Symbol: ${data.quoteType.longName}`;
            newsContent.append(fullSymbolName);

            stockSymbol = document.createElement("span");
            stockSymbol.textContent = `Symbol: ${data.symbol}`;
            newsContent.append(stockSymbol);

            var price = document.createElement("span");
            price.textContent = `Price: ${data.price.regularMarketPrice.fmt}`;
            newsContent.append(price);

            var fifty2WeekHigh = document.createElement("span");
            fifty2WeekHigh.textContent = `52 High: ${data.summaryDetail.fiftyTwoWeekHigh.raw}`;
            newsContent.append(fifty2WeekHigh);

            var fifty2WeekLow = document.createElement("span");
            fifty2WeekLow.textContent = `52 Low: ${data.summaryDetail.fiftyTwoWeekLow.raw}`;
            newsContent.append(fifty2WeekLow);




            var linkToYahoo = document.createElement("a");
            linkToYahoo.setAttribute("href", `https://finance.yahoo.com/quote/${data.symbol}`);
            linkToYahoo.setAttribute("target", "_blank");
            linkToYahoo.textContent = "Link to Yahoo: " + data.symbol;
            newsContent.appendChild(linkToYahoo);

            var symbolSummary = document.createElement("span");
            symbolSummary.textContent = `Summary: ${data.summaryProfile.longBusinessSummary}`
            newsContent.appendChild(symbolSummary);

            // -----------------------------------------------------------------------

            // Add symbol to front of history list
            stockSymbolArray.unshift(data.symbol);
            stockSymbolArray.pop();
            console.log(stockSymbolArray);  
            // Store history list locally          
            localStorage.setItem("stock-history", JSON.stringify(stockSymbolArray));
            // Render the history list on the page
            renderStockHistory();


            // for (var i = 0; i < data.news.length; i++) {
            //     var stockArtImg = document.createElement("img");
            //     
            // }

        })
        .catch(err => {
            console.error(err);
        });
}

var articleContent = document.querySelector("#articles-content");

//gets random stock news and automatically appears on page------------------------
function getApiNews() {


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

                // Add news image to figure
                var newsImg = document.createElement("img");
                if (data.items.result[i].main_image === null) {
                    newsImg.setAttribute("alt", "News Anchor");
                    newsImg.src = "https://image.shutterstock.com/image-vector/news-anchor-on-tv-breaking-260nw-442698565.jpg";
                } else {
                    newsImg.setAttribute("alt", data.items.result[i].title);
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

                // Add read article button to specific news container
                var showMoreButton = document.createElement("button");
                showMoreButton.textContent = "Read Article"
                showMoreButton.setAttribute('id', 'show-more-' + i)
                newsItemContent.appendChild(showMoreButton);

                showMoreButton.addEventListener("click", function (event) {

                    document.querySelector(".modal").classList.add("is-active");
                });
                
                // Modal setup goes here for article click
                var modalBody = document.querySelector(".modal-card-body");

                var infoCard = document.createElement("div");
                infoCard.classList.add("card");

                var cardContent = document.createElement("div");
                cardContent.classList.add("card-content");
                infoCard.appendChild(cardContent);

                var cardBody = document.createElement("div");
                cardBody.classList.add("content");
                cardBody.innerHTML = data.items.result[i].content;
                cardContent.appendChild(cardBody);

                // append to page
                modalBody.append(infoCard);
                // cardHeadContainer.appendChild(infoCard);
                newsContent.append(newsItemEl);

                var cancelButton = document.querySelector("#cancel-button");

                cancelButton.addEventListener("click", function (event) {
                    event.stopPropagation();
                    var element = event.target;
                    if (element.matches("button")) {
                        document.querySelector(".modal").classList.remove("is-active");
                    }
                    
                })
            };
        })
    }



                //card header
                /*
                var cardHeadContainer = document.createElement("article");
                cardHeadContainer.classList.add("mb-3", "card", "columns", "is-align-items-center", "has-background-primary", "p-2");
                newsContent.appendChild(cardHeadContainer);

                var cardHeader = document.createElement("div");
                cardHeader.classList.add("title", "column", "is-size-4", "is-flex-direction-column");
                cardHeader.textContent = data.items.result[i].title;
                cardHeadContainer.appendChild(cardHeader);

                var artAuthor = document.createElement("p");
                artAuthor.classList.add("pl-3", "subtitle");
                if (data.items.result[i].author = " ") {
                    artAuthor.textContent = data.items.result[i].publisher;
                } else {
                    artAuthor.textContent = data.items.result[i].author;

                }
                cardHeader.appendChild(artAuthor);

                var artImageContainer = document.createElement("figure");
                artImageContainer.classList.add("image", "is-128x128");
                cardHeader.appendChild(artImageContainer);

                var artImage = document.createElement("img");            

                if (data.items.result[i].main_image === null) {
                    artImage.setAttribute("alt", "News Anchor");
                    artImage.src = "https://image.shutterstock.com/image-vector/news-anchor-on-tv-breaking-260nw-442698565.jpg";
                } else {
                    // artImage.setAttribute("style", "max-height: 900px; max-width: 900px;")
                    artImage.src = data.items.result[i].main_image.original_url;
                }
                
                artImageContainer.appendChild(artImage);

                */

                //-------------if body content is null do something------------------------------------------------------------------------------------------------


                // card body will append to header
                /*
                var modalBody = document.querySelector(".modal-card-body");

                var infoCard = document.createElement("div");
                infoCard.classList.add("card");

                var cardContent = document.createElement("div");
                cardContent.classList.add("card-content");
                infoCard.appendChild(cardContent);

                var cardBody = document.createElement("div");
                cardBody.classList.add("content");
                cardBody.innerHTML = data.items.result[i].content;
                cardContent.appendChild(cardBody);

                // append to page
                modalBody.append(infoCard);
                // cardHeadContainer.appendChild(infoCard);
                articleContent.appendChild(cardHeadContainer);


                var showMoreButton = document.createElement("button");
                showMoreButton.textContent = "Read Article"
                showMoreButton.setAttribute('id', 'show-more-' + i)
                cardHeader.appendChild(showMoreButton);

                showMoreButton.addEventListener("click", function (event) {

                    // var hi = this.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.children[1].children[1];
                    // console.log("body of modal",hi);
                    // hi = data.items.
                    // modalBody.innerHTML = hi;
                    // console.log(hi);

                    document.querySelector(".modal").classList.add("is-active");

                    
                }
                
                var cancelButton = document.querySelector("#cancel-button");

                cancelButton.addEventListener("click", function (event) {
                    document.querySelector(".modal").classList.remove("is-active");

                    

                })
                
            }
        })
        */
        /*
        .catch(err => {
            console.error(err);
        });
        */



var stockNewsLinks = document.querySelector("#stock-news-links");
var articlePicture = document.querySelector("#article-picture");
var articleHrefLinks = document.querySelector("#article-href-links");


//has stock symbol and can access news relating-----------------------------------
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

            for (var i = 0; i < 5; i++) {
                articlePicture.innerHTML = "";
                articleHrefLinks.innerHTML = "";
                var specificStockArtImg = document.createElement("img");

                if (data.items.result[i].main_image === null) {
                    specificStockArtImg.setAttribute("alt", "Stock News Image");
                    specificStockArtImg.src = "https://image.freepik.com/free-photo/financial-stock-market-graph-chart-stock-market-investment-trading-screen_9693-990.jpg";
                    specificStockArtImg.setAttribute("width", 100);
                    articlePicture.appendChild(specificStockArtImg);
                } else {
                    specificStockArtImg.src = data.items.result[i].main_image.original_url;
                    specificStockArtImg.setAttribute("width", 100);
                    articlePicture.appendChild(specificStockArtImg);
                }
                // var specificStockArtLink = document.createElement("div");
                // specificStockArtLink.textContent = 
            }

        })
        .catch(err => {
            console.error(err);
        });
}

function getRedditApi() {

}

var stockSymbolArray = ["GME", "FB", "AAPL", "GE", "F", "BAC", "AMD", "MSFT", "SPCE", "GOOG"];





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
    // articleContent.classList.add("hide");

    if (searchStock === "") {
        return;
    }

    //stockContainer.classList.remove("hide");
    input.value = "";
    getApi(searchStock);
    apiSymbolArticle(searchStock);
}

// Clear local storage button functionality 
function clearHistory() {
    localStorage.clear();
    stockSymbolArray = ["GME", "FB", "AAPL", "GE", "F", "BAC", "AMD", "MSFT", "SPCE", "GOOG"];
    renderStockHistory();
}

// Make history buttons run the getAPI function for given symbol
function getHistoryItemInfo(event) {
    event.preventDefault();
    var element = event.target;
    console.log(element);    

    if (element.matches("button") === true) {
        var historyIndex = element.getAttribute("data-index");
        historySymbol = stockSymbolArray[historyIndex];
        
        // newsContent.classList.add("hide");
        //stockContainer.classList.remove("hide");        
        
        getApi(historySymbol);
        apiSymbolArticle(historySymbol);
    }

    
}

function init() {

    // get symbols from local storage
    var storedStockSymbols = JSON.parse(localStorage.getItem("stock-history"));

    // if local storage not empty
    if (storedStockSymbols !== null) {
        // stock array = local storage
        stockSymbolArray = storedStockSymbols;
    }

    // then render the history
    renderStockHistory();
}

init();


clearLocalHistoryBtn.addEventListener("click", clearHistory);

historyElement.addEventListener("click", getHistoryItemInfo);