(function () {
    function getMaximalCitiesCountCountries(countries) {
        var maximalCitiesCount = countries.reduce(function (maximalCitiesCount, country) {
            return Math.max(country["cities"].length, maximalCitiesCount);
        }, 0);

        return countries.filter(function (country) {
            return country["cities"].length === maximalCitiesCount;
        }).map(function (country) {
            return country.name;
        });
    }

    function getCountriesPopulation(countries) {
        return countries.map(function (country) {
            var citiesPopulation = country["cities"].reduce(function (summa, city) {
                return summa + city["population"];
            }, 0);

            return ({population: citiesPopulation, name: country["name"]});
        });
    }

    var countries = [
        {
            name: "Australia",
            cities: [
                {name: "Canberra", population: 431826},
                {name: "Melbourne", population: 4936349},
                {name: "Perth", population: 2059484},
                {name: "Redcliffe", population: 10373},
                {name: "Maitland", population: 78015},
                {name: "Sydney", population: 5230330}
            ]
        },
        {
            name: "Germany",
            cities: [
                {name: "Berlin", population: 3520031},
                {name: "Hamburg", population: 1787408},
                {name: "Munich", population: 1450381},
                {name: "Cologne", population: 1060582}
            ]
        },
        {
            name: "Italy",
            cities: [
                {name: "Roma", population: 2867078},
                {name: "Milano", population: 1350487},
                {name: "Napoli", population: 972212},
                {name: "Torino", population: 889600},
                {name: "Palermo", population: 671531}
            ]
        },
        {
            name: "Spain",
            cities: [
                {name: "Canberra", population: 3265038},
                {name: "Melbourne", population: 1615448},
                {name: "Perth", population: 798033}
            ]
        }
    ];

    console.log("Страны с максимальным количеством городов: " + getMaximalCitiesCountCountries(countries));

    console.log("Суммарное население городов по странам:");

    var countriesPopulation = getCountriesPopulation(countries);

    countriesPopulation.forEach(function (country) {
        console.log(country.name + " " + country.population)
    });
})();