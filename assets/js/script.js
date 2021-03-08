var input = document.querySelector("#input");
var searchBtn = document.querySelector("#search");
var stockInfo = document.querySelector("#stock-info");


var financeApiKey = "f2e83bae15msh3de8865564383bbp1b8df0";

var toggle = document.querySelector("#nav-toggle");
var menu = document.querySelector("#nav-menu");
var moreBtn = document.querySelector("#nav-more");
var moreDropdown = document.querySelector("#nav-dropdown");

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

            stockInfo.innerHTML = "";

            var stockLogo = document.createElement("img");
            // if (`https://logo.uplead.com/${data.summaryProfile.website.split("http://www.")[1]}` === 404){
            //     console.log("fuck off");
            // }
            stockLogo.setAttribute("src", `https://logo.uplead.com/${data.summaryProfile.website.split("http://www.")[1]}`);
            stockLogo.setAttribute("width", 100);
            stockInfo.appendChild(stockLogo);

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

            var fifty2WeekLow = document.createElement("span");
            fifty2WeekLow.textContent = `52 Low: ${data.summaryDetail.fiftyTwoWeekLow.raw}`;
            stockInfo.appendChild(fifty2WeekLow);




            var linkToYahoo = document.createElement("a");
            linkToYahoo.setAttribute("href", `https://finance.yahoo.com/quote/${data.symbol}`);
            linkToYahoo.setAttribute("target", "_blank");
            linkToYahoo.textContent = "Link to Yahoo: " + data.symbol;
            stockInfo.appendChild(linkToYahoo);

            var symbolSummary = document.createElement("span");
            symbolSummary.textContent = `Summary: ${data.summaryProfile.longBusinessSummary}`
            stockInfo.appendChild(symbolSummary);

            // -----------------------------------------------------------------------



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
                articleContent.appendChild(cardHeadContainer);

                var artAuthor = document.createElement("p");

                if (data.items.result[i].author = " ") {
                    artAuthor.textContent = "Publisher: " + data.items.result[i].publisher;
                } else {
                    artAuthor.textContent = "Author: " + data.items.result[i].author;

                }
                cardHeader.appendChild(artAuthor);

                var artImage = document.createElement("img");

                if (data.items.result[i].main_image === null) {
                    artImage.setAttribute("alt", "News Anchor");
                    artImage.src = "https://image.shutterstock.com/image-vector/news-anchor-on-tv-breaking-260nw-442698565.jpg";
                } else {
                    // artImage.setAttribute("style", "max-height: 900px; max-width: 900px;")
                    artImage.src = data.items.result[i].main_image.original_url;
                }
                cardHeader.appendChild(artImage);

                //-------------if body content is null do something------------------------------------------------------------------------------------------------


                // card body will append to header
                var modalBody = document.querySelector(".modal-card-body");

                // append to page
                
                
                var showMoreButton = document.createElement("button");
                showMoreButton.textContent = "Read Article"
                showMoreButton.setAttribute('id', 'show-more-' + i)
                cardHeader.appendChild(showMoreButton);
                
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

                var cancelButton = document.querySelector("#cancel-button");

                cancelButton.addEventListener("click", function (event) {
                    document.querySelector(".modal").classList.remove("is-active");

                })
            }
        })
        .catch(err => {
            console.error(err);
        });
}

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
            
            articlePicture.innerHTML = "";
            for(var i = 0 ; i < 5; i++){
                var specificStockArtImg = document.createElement("img");
                
                if(data.items.result[i].main_image === null) {
                    specificStockArtImg.setAttribute("alt", "Stock News Image");
                    specificStockArtImg.src = "https://image.freepik.com/free-photo/financial-stock-market-graph-chart-stock-market-investment-trading-screen_9693-990.jpg";
                } else {
                    specificStockArtImg.src = data.items.result[i].main_image.original_url;
                }
                
                
                var divOut = document.createElement("div");
                divOut.classList.add("is-five-fifths", "is-flex", "is-align-items-center", "is-flex-wrap-wrap", "columns");
                articlePicture.appendChild(divOut)

                var divvvv = document.createElement("div");

                // specificStockArtImg.setAttribute("style", "margin: 30px; border-radius: 10px;");
                specificStockArtImg.setAttribute("width", 100);  
                divvvv.classList.add("column", "is-one-fifth", "m-0");                 
                specificStockArtImg.classList.add("is-five-fifths", "is-rounded");  
                divvvv.appendChild(specificStockArtImg);
                divOut.appendChild(divvvv);    
                
                var specificStockArtLink = document.createElement("a");
                specificStockArtLink.setAttribute("href", data.items.result[i].link);
                specificStockArtLink.setAttribute("target", "_blank");
                specificStockArtLink.classList.add("is-size-4", "column", "is-four-fifths", "m-0");
                specificStockArtLink.textContent = data.items.result[i].title;
                divOut.append(specificStockArtLink);
            }

        })
        .catch(err => {
            console.error(err);
        });
}

function getRedditApi() {

}



var stockContainer = document.querySelector("#stock-container");
searchBtn.addEventListener("click", searchClickHandler);

function searchClickHandler() {
    var searchStock = input.value;
    articleContent.classList.add("hide");
    stockContainer.classList.remove("hide");
    getApi(searchStock);
    apiSymbolArticle(searchStock);
}