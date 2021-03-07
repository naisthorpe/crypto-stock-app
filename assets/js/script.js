var input = document.querySelector("#input");
var searchBtn = document.querySelector("#search");
// var stockSymbol = document.querySelector("#stocks-symbol");
// var stockPrice = document.querySelector("#stock-price");
var stockInfo = document.querySelector("#stock-info");
var stockNewsLinks = document.querySelector("#stock-news-links"); 

var financeApiKey = "4a00cf8832msh0859ae98812ca8fp10d693jsn519ea8ffd89d";

var toggle = document.querySelector("#nav-toggle");
var menu = document.querySelector("#nav-menu");
var moreBtn = document.querySelector("#nav-more");
var moreDropdown = document.querySelector("#nav-dropdown");

toggle.addEventListener("click", function() {
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

moreBtn.addEventListener("click", function() {
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

            stockInfo.innerHTML = "";
            var fullSymbolName = document.createElement("span");            
            fullSymbolName.textContent = `Symbol: ${data.quoteType.longName}`;
            stockInfo.appendChild(fullSymbolName);

            var symbol = document.createElement("span");
            symbol.textContent = `Symbol: ${data.symbol}`;
            stockInfo.appendChild(symbol);

            var price = document.createElement("span");
            price.textContent = `Price: ${data.price.regularMarketPrice.fmt}`;
            stockInfo.appendChild(price);

            var fifty2WeekHigh = document.createElement("span");
            fifty2WeekHigh.textContent = `52 High: ${data.summaryDetail.fiftyTwoWeekHigh.raw}`;
            stockInfo.appendChild(fifty2WeekHigh);

            var fifty2WeekLow  = document.createElement("span");
            fifty2WeekLow.textContent = `52 Low: ${data.summaryDetail.fiftyTwoWeekLow.raw}`;
            stockInfo.appendChild(fifty2WeekLow);

            var linkToYahoo  = document.createElement("a");
            linkToYahoo.setAttribute("href", `https://finance.yahoo.com/quote/${data.symbol}`);
            linkToYahoo.setAttribute("target", "_blank");
            linkToYahoo.textContent = "Link to Yahoo";
            stockInfo.appendChild(linkToYahoo);

            var symbolSummary = document.createElement("span");
            symbolSummary.textContent = `Summary: ${data.summaryProfile.longBusinessSummary}`
            stockInfo.appendChild(symbolSummary);
            
        })
        .catch(err => {
            console.error(err);
        });
}




var stockArticles = document.querySelector("#stock-articles");
var articleName = document.querySelector("#article-name");
var articleAuthor = document.querySelector("#article-author");
var articleLink = document.querySelector("#article-link");
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

            var articleHeader = document.createElement("h1");
            articleHeader.classList.add("has-text-centered", "is-size-1");
            articleHeader.innerHTML = "";
            articleHeader.textContent = "New Articles";
            articleContent.appendChild(articleHeader);

            for (var i = 0; i < data.items.result.length; i++) {

                //card header
                var cardHeadContainer = document.createElement("div");
                cardHeadContainer.classList.add("card", "m-6", "is-align-items-center", "has-background-grey-light", "p-3");

                var cardHeader = document.createElement("header");
                cardHeader.classList.add("card-header", "is-size-4", "is-flex-direction-column");
                cardHeader.textContent = "Title: " + data.items.result[i].title;
                cardHeadContainer.appendChild(cardHeader);

                var artAuthor = document.createElement("p");

                if (data.items.result[i].author = " ") {
                    artAuthor.textContent = "Publisher: " + data.items.result[i].publisher;
                } else {
                    artAuthor.textContent = "Author: " + data.items.result[i].author;

                }
                cardHeader.appendChild(artAuthor);

                var artImage = document.createElement("img");

                if (data.items.result[i].main_image === null) {
                    artImage.src = "https://image.shutterstock.com/image-vector/news-anchor-on-tv-breaking-260nw-442698565.jpg";
                } else {
                    // artImage.setAttribute("style", "max-height: 900px; max-width: 900px;")
                    artImage.src = data.items.result[i].main_image.original_url;
                }
                cardHeader.appendChild(artImage);

                //-------------if body content is null do something------------------------------------------------------------------------------------------------


                // card body will append to header
                var infoCard = document.createElement("div");
                infoCard.classList.add("card", "hide");

                var cardContent = document.createElement("div");
                cardContent.classList.add("card-content");
                infoCard.appendChild(cardContent);

                var cardBody = document.createElement("div");
                cardBody.classList.add("content");
                cardBody.innerHTML = data.items.result[i].content;
                cardContent.appendChild(cardBody);

                // append to page
                cardHeadContainer.appendChild(infoCard);
                articleContent.appendChild(cardHeadContainer);

                var showMoreButton = document.createElement("button");
                showMoreButton.textContent = "Read Article"
                showMoreButton.setAttribute('id', 'show-more-' + i)
                cardHeader.appendChild(showMoreButton);
                
                // showMoreButton.addEventListener("click", function (event) {
                //     console.log('MORE BUTTON', event.target)
                //     infoCard.classList.remove("hide");
                // })               
            }           
        })
        .catch(err => {
            console.error(err);
        });
    }
    
    
    //has stock symbol and can access news relating-----------------------------------
    function apiSymbolArticle(symbolArt) {
        fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?q=${symbolArt}&region=US`, {
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
        })
        .catch(err => {
            console.error(err);
        });
}

function getRedditApi() {

}




searchBtn.addEventListener("click", searchClickHandler);

function searchClickHandler() {
    var searchStock = input.value;
    articleContent.classList.add("hide");
    getApi(searchStock);
    apiSymbolArticle(searchStock);

}