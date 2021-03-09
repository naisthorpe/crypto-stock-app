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

var homeButton = document.querySelector("#home-button");
var yahooFinButton = document.querySelector("#yahoo-fin-button");
var bitcoinButton = document.querySelector("#bitcoin-button");
var redditButton = document.querySelector("#reddit-button");

homeButton.addEventListener("click", getApiRandomNews);

yahooFinButton.addEventListener("click", function () {
    window.open("https://finance.yahoo.com/", "_blank");
});

bitcoinButton.addEventListener("click", function () {
    window.open("https://bitinfocharts.com/bitcoin/", "_blank")
});

redditButton.addEventListener("click", function () {
    window.open("https://www.reddit.com/r/investing/new/", "_blank");
});


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
            stockItemImgEl.setAttribute("style", "border-right: solid silver 2px");
            stockItemImgEl.classList.add("column", "is-3", "image", "is-align-content-center", "is-flex", "is-flex-direction-column", "is-justify-content-space-between");
            stockItemEl.appendChild(stockItemImgEl);

            // Add stock image to figure
            var stockLogo = document.createElement("img");
            
            stockLogo.setAttribute("src", `https://logo.uplead.com/${data.summaryProfile.website.split("http://www.")[1]}`);
            stockLogo.setAttribute("onerror","this.onerror=null; this.src='data:image/jpeg;base64,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';" )
            stockItemImgEl.append(stockLogo);
            
            // Add container for stock info
            var stockInfoEl = document.createElement("div");
            stockInfoEl.setAttribute("class", "column is-9");
            stockItemEl.append(stockInfoEl);
            
            // making div for symbol title
            var symbolTitleDiv = document.createElement("div");
            stockInfoEl.appendChild(symbolTitleDiv);
            
            // adding stats div for stats to create columns
            var statColumnDiv = document.createElement("div");
            statColumnDiv.classList.add("columns", "is-flex", "is-justify-content-space-around", "m-0");
            stockInfoEl.appendChild(statColumnDiv);
            

            // Add symbol full name 
            var fullSymbolName = document.createElement("p");
            fullSymbolName.classList.add("column", "is-two-fifth", "m-0", "is-flex", "is-justify-content-center", "is-size-2", "has-text-weight-bold");
            fullSymbolName.textContent = `${data.quoteType.longName} (${data.symbol})`;
            symbolTitleDiv.appendChild(fullSymbolName);



            // Add stock price
            var price = document.createElement("p");
            price.classList.add("column", "is-two-fifth", "m-0","has-text-centered", "has-text-weight-bold");
            price.textContent = `Price: $${data.price.regularMarketPrice.fmt}`;
            statColumnDiv.appendChild(price);

            // Add 52 week high
            var fifty2WeekHigh = document.createElement("p");
            fifty2WeekHigh.classList.add("column", "is-two-fifth", "m-0","has-text-centered", "has-text-weight-bold");
            fifty2WeekHigh.textContent = `52 High: $${data.summaryDetail.fiftyTwoWeekHigh.raw}`;
            statColumnDiv.appendChild(fifty2WeekHigh);

            // Add 52 week low
            var fifty2WeekLow = document.createElement("p");
            fifty2WeekLow.classList.add("column", "is-two-fifth", "m-0", "has-text-centered", "has-text-weight-bold");
            fifty2WeekLow.textContent = `52 Low: $${data.summaryDetail.fiftyTwoWeekLow.raw}`;
            statColumnDiv.appendChild(fifty2WeekLow);

            // Add link to yahoo - specific to given symbol
            var linkToYahoo = document.createElement("a");
            linkToYahoo.classList.add("column", "is-two-fifth", "m-0", "has-text-centered", "mb-6", "is-flex", "is-flex-direction-column","is-justify-content-flex-end");
            linkToYahoo.setAttribute("href", `https://finance.yahoo.com/quote/${data.symbol}`);
            linkToYahoo.setAttribute("target", "_blank");
            linkToYahoo.textContent = "Link to Yahoo: " + data.symbol;
            stockItemImgEl.appendChild(linkToYahoo);

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

                //Add Container for Title
                var redditTitleEl = document.createElement("div");
                redditTitleEl.setAttribute("class", "column");
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

            newsContent.innerHTML = "";

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

// ------------------------------------------------------------------------

var historyTab = document.querySelector(".history-tab");
var favorites = document.querySelector(".favorites-tab");

favorites.addEventListener("click", function () {
    historyTab.classList.remove("is-active");
    favorites.classList.add("is-active");
    // favoritesList();
});

historyTab.addEventListener("click", function () {
    favorites.classList.remove("is-active");
    historyTab.classList.add("is-active");
    init();
});

// function favoritesList() {
//     for (var i = 0; i < stockSymbolArray.length; i++){
//         // var historyElementList = 
//         // document.getElementById(`history-${i}`).innerHTML = "";
//         // historyElementList.innerHTML = "";
//         // historyElementList.value = "";

//     }
// };



//-------------------------------------------------------------------------

var reportIssue = document.querySelector(".report-issue");
var reportModal = document.querySelector(".report-modal");
var cancelIssue = document.querySelector(".cancel-issue");

reportIssue.addEventListener("click", function () {
    reportModal.classList.add("is-active");
});

cancelIssue.addEventListener("click", function () {
    reportModal.classList.remove("is-active");
});

var formEl = $('#issue-form');
var firstNameEl = $('input[name="first-name"]');
var emailEl = $('input[name="email"]');
var messageEl = $('input[name="issue-message"]')

function handleFormSubmit(event) {
    event.preventDefault();

    console.log('First Name:', firstNameEl.val());
    console.log('Email:', emailEl.val());

    $('input[type="text"]').val('');
    $('input[type="email"]').val('');
    $('textarea[type="message"]').val('');
}

formEl.on('submit', handleFormSubmit);




// ------------------------------------------------------------------------

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