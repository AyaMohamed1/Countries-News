var countriesComponent = {
  URL: `https://restcountries.com/v3.1/all`,
  data: {},
  init: function () {
    this.fetchData(this.URL);
    this.cacheElements();
  },

  fetchData: async function (URL) {
    const response = await fetch(URL);
    let countriesData = await response.json();
    this.data = countriesData;
    // console.log(this.data);
    this.render();
  },

  cacheElements: function () {
    this.countries = $("#countries");
  },

  render: function () {
    this.data.splice(38, 1);
    let dataForCountryDetails = this.data;
    // console.log(this.data);
    let countriesCards = ``;
    countries.innerHTML = "";
    for (let i = 0; i < this.data.length; i++) {
      let countryCard = ``;
      if (i % 4 == 0) {
        if (i != 0) {
          countriesCards += `</div> </div>
                                <div class="carousel-item">
                                <div class="row">`;
        } else {
          countriesCards += `
                <div class="carousel-item active">
                    <div class="row">
                `;
        }
      }
      countryCard = `        
            <div class="col-md-3">
                <div class="card h-100" id="card-${i}">
                <img
                    src="${this.data[i].flags.png}"
                    class="card-img-top"
                    alt="${this.data[i].name.official}-flag"
                />
                <div class="card-body mx-auto">
                    <h5 class="card-title">${this.data[i].name.common}</h5>
                    <p class="card-text">${this.data[i].capital}</p>
                </div>
                </div>
            </div>`;

      countriesCards += countryCard;
      if (i == this.data.length - 1) {
        countriesCards += `</div> </div>`;
      }
    }
    countries.innerHTML = countriesCards;

    // check if this place is true
    $(".card").on("click", function () {
      this.countryClickedId = $(this).attr("id");
      this.countryClickedId = this.countryClickedId.replace("card-", "");
      this.dataForCountryDetailsObj = {
        dataForCountryDetails,
        countryClickedId: this.countryClickedId,
      };
      eventsMediator.emit("country.clicked", this.dataForCountryDetailsObj);
    });
  },
};

var selectedCountryComponent = {
  init: function () {
    this.cacheElements();
    this.bindEvents();
  },

  cacheElements: function () {
    this.countryFlag = document.getElementById("country-flag");
    this.countryDetails = document.getElementById("country-details");
  },

  bindEvents: function () {
    eventsMediator.on("country.clicked", this.setCountryData.bind(this));
  },

  setCountryData: function (data) {
    this.flag = data.dataForCountryDetails[data.countryClickedId].flags.png;
    this.countryName =
      data.dataForCountryDetails[data.countryClickedId].name.common;
    this.countryCapital =
      data.dataForCountryDetails[data.countryClickedId].capital[0];
    //   calculated
    let currencies =
      data.dataForCountryDetails[data.countryClickedId].currencies;
    let currenciesKeys = Object.keys(currencies);
    this.currency = currencies[currenciesKeys[0]].name;
    let languages = data.dataForCountryDetails[data.countryClickedId].languages;
    let languagesKeys = Object.keys(languages);
    this.language = languages[languagesKeys[0]];
    this.population =
      data.dataForCountryDetails[data.countryClickedId].population;
    this.subregion =
      data.dataForCountryDetails[data.countryClickedId].subregion;
    this.timeZone =
      data.dataForCountryDetails[data.countryClickedId].timezones[0];
    // needs to be calculated???
    this.neighbors = "";
    //

    this.render();
  },

  render: function () {
    this.countryFlag.src = this.flag;
    this.countryDetails.innerHTML = "";
    let countryDetailsDivstr = `
        <h4>${this.countryName}</h4>
        <h6>Capital: ${this.countryCapital}</h6>
        <h6>Currency: ${this.currency}</h6>
        <h6>Language: ${this.language}</h6>
        <h6>Population: ${this.population}</h6>
        <h6>Subregion: ${this.subregion}</h6>
        <h6>TimeZone: ${this.timeZone}</h6>
        <h6>Neighbors: ${this.neighbors}</h6>
    `;
    this.countryDetails.innerHTML = countryDetailsDivstr;
  },
};

var newsComponent = {
  init: function () {
    this.cacheElements();
    this.bindEvents();
  },

  fetchData: async function (data) {
    this.data = data;
    let countryCCA2 =
      data.dataForCountryDetails[data.countryClickedId].cca2.toLowerCase();
    let newsURL = `https://newsapi.org/v2/top-headlines?country=${countryCCA2}&apiKey=c217a832401543a5921dca4b36150004`;
    const response = await fetch(newsURL);
    let newsData = await response.json();
    this.dataForNews = newsData;

    this.render();
  },

  cacheElements: function () {
    this.news = document.getElementById("news");
  },

  bindEvents: function () {
    eventsMediator.on("country.clicked", this.fetchData.bind(this));
  },

  render: function () {
    // console.log(this.data);
    // console.log(this.dataForNews);
    this.news.innerHTML = "";
    if (this.dataForNews.articles == 0) {
      let notFound = `
            <div class="border border-2 border-light txt-white text-center">
            <h4>Uh Oh, There is no News for ${
              this.data.dataForCountryDetails[this.data.countryClickedId].name
                .common
            } today!</h4>
            </div>`;
      this.news.innerHTML = notFound;
    } else {
      let newsCards = "";
      for (let i = 0; i < this.dataForNews.articles.length; i++) {
        let newsCard = `
            <div class="row border border-1 border-light">
                <div class="col-lg-4">
                    <img class="w-26 my-4 ms-3" src="${
                      this.dataForNews.articles[i].urlToImage
                    }" alt="">
                    </div>
                <div class="col-lg-7">
                    <div class="my-4">
                        <h5>${this.dataForNews.articles[i].title}</h5>
                        <h6>${this.dataForNews.articles[i].description}</h6>
                        <div class="d-flex align-items-end flex-column">
                            <h6>${this.dataForNews.articles[i].source.name}</h6>
                            <h6>${this.dataForNews.articles[
                              i
                            ].publishedAt.substring(0, 10)}</h6>
                        </div>
                        
                    </div>
                </div>
            </div>`;
        newsCards += newsCard;
      }
      this.news.innerHTML = newsCards;
    }
  },
};

var eventsMediator = {
  events: {},
  on: function (eventName, callBackFun) {
    this.events[eventName] = this.events[eventName]
      ? this.events[eventName]
      : [];
    this.events[eventName].push(callBackFun);
  },

  emit: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (callBackFun) {
        callBackFun(data);
      });
    }
  },
};

countriesComponent.init();
selectedCountryComponent.init();
newsComponent.init();
