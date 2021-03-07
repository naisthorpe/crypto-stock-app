var input = document.querySelector("#input");
var searchBtn = document.querySelector("#search");
var stockSymbol = document.querySelector("#stocks-symbol");
var stockPrice = document.querySelector("#stock-price");

getApiNews();

//-------------------------------------link search to articles by symbol or label-------------------------------------------------------------------------------
//-------------------------------------attach .entities[i].label or term----------------------------------------------------------------------------------------

//searches for symbol of stock------------------quoteType and go splice the 2 words so you dont have to search corporation or whatever other word at the end?????????????????
function getApi(symbol) {

    fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=${symbol}&region=US`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "4a00cf8832msh0859ae98812ca8fp10d693jsn519ea8ffd89d",
            "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Symbol Financials:");
            console.log(data);



            var symbol = document.createElement("span");
            symbol.textContent = data.symbol;
            stockSymbol.innerHTML = "Symbol: ";
            stockSymbol.append(symbol)

            var price = document.createElement("span");
            price.textContent = data.price.preMarketPrice.fmt;
            stockPrice.innerHTML = "Price: ";
            stockPrice.append(price);
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
            "x-rapidapi-key": "4a00cf8832msh0859ae98812ca8fp10d693jsn519ea8ffd89d",
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
            "x-rapidapi-key": "4a00cf8832msh0859ae98812ca8fp10d693jsn519ea8ffd89d",
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