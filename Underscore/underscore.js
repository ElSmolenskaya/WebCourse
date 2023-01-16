(function () {
    function getAverageAge(people) {
        return _.chain(people)
            .reduce(function (agesSum, people) {
                return agesSum + people.age;
            }, 0)
            .value() / _.size(people);
    }

    function getFrom20To30AgedPeople(people) {
        return _.chain(people)
            .filter(function (person) {
                return person.age >= 20 && person.age <= 30;
            })
            .sortBy("age")
            .value();
    }

    function getFrom20To30AgedPeopleUniqueNames(people) {
        return _.chain(people)
            .filter(function (person) {
                return person.age >= 20 && person.age <= 30;
            })
            .pluck("name")
            .uniq()
            .sortBy()
            .reverse()
            .value();
    }

    function getNamesCounts(people) {
        return _.chain(people)
            .countBy(function (people) {
                return people.name;
            })
            .value();
    }

    var people = [
        {name: "Matvei", age: 21},
        {name: "Leonid", age: 45},
        {name: "Boris", age: 22},
        {name: "Marina", age: 16},
        {name: "Polina", age: 38},
        {name: "Matvei", age: 29},
        {name: "Boris", age: 25},
        {name: "Erica", age: 29},
        {name: "Renat", age: 45},
        {name: "Artem", age: 30},
        {name: "Anastasia", age: 17},
        {name: "Bogdan", age: 18}
    ];

    var averageAge = getAverageAge(people);

    console.log("Average age = " + averageAge);

    var from20To30AgedPeople = getFrom20To30AgedPeople(people);

    console.log("People aged 20 to 30 years old sorted by age in ascending order:");

    _.each(from20To30AgedPeople, function (person) {
        console.log(person.name + " - " + person.age);
    });

    var from20To30AgedPeopleUniqueNames = getFrom20To30AgedPeopleUniqueNames(people);

    console.log("Unique names of people aged 20 to 30 years old sorted in descending order:");

    _.each(from20To30AgedPeopleUniqueNames, function (name) {
        console.log(name);
    });

    var namesCounts = getNamesCounts(people);

    console.log("An object where key is name and value is names count:");

    for (var name in namesCounts) {
        console.log(name + " - " + namesCounts[name]);
    }
})();