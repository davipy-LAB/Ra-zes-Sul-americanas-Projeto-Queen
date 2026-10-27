
const countryList = document.querySelector("#country-list");
const countrySearch = document.querySelector("#country-search");
const countryDetails = document.querySelector("#country-details");

let countries = [];

const topics = [
    ["history", "Contexto histórico"],
    ["capital", "Capital"],
    ["indigenous_peoples", "Povos originários"],
    ["language", "Idioma"],
    ["gastronomy", "Gastronomia"],
    ["sports", "Esporte"],
    ["music", "Músicas"],
    ["dances", "Danças"],
];

async function loadCountries() {
    try {
        const response = await fetch("/api/countries");

        if (!response.ok) {
            throw new Error("Não foi possível carregar os países.");
        }

        countries = await response.json();
        renderCountryList(countries);
    } catch (error) {
        countryList.textContent = "Erro ao carregar os países.";
        console.error(error);
    }
}

function renderCountryList(items) {
    countryList.replaceChildren();

    if (items.length === 0) {
        countryList.textContent = "Nenhum país encontrado.";
        return;
    }

    for (const country of items) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "country-card";
        button.setAttribute("aria-pressed", "false");

        const flag = document.createElement("span");
        flag.className = "country-flag";
        flag.textContent = country.flag;

        const name = document.createElement("strong");
        name.textContent = country.name;

        button.append(flag, name);
        button.addEventListener("click", () => selectCountry(country.id));

        countryList.append(button);
    }
}

function selectCountry(countryId) {
    const country = countries.find(item => item.id === countryId);

    if (!country) return;

    countryList.querySelectorAll(".country-card").forEach(button => {
        const isSelected =
            button.querySelector("strong").textContent === country.name;

        button.setAttribute("aria-pressed", String(isSelected));
    });

    countryDetails.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = `${country.flag} ${country.name}`;

    countryDetails.append(heading);

    for (const [key, title] of topics) {
        const section = document.createElement("article");
        section.className = "topic";

        const topicHeading = document.createElement("h3");
        topicHeading.textContent = title;
        section.append(topicHeading);

        const value = country[key];

        if (key === "capital" || key === "language") {
            const paragraph = document.createElement("p");
            paragraph.textContent = value ?? "Informação a adicionar.";
            section.append(paragraph);
        } else {
            const list = document.createElement("ul");
            const items = Array.isArray(value)
                ? value
                : value
                    ? [value]
                    : [];

            if (items.length === 0) {
                const li = document.createElement("li");
                li.textContent = "Conteúdo a adicionar.";
                list.append(li);
            } else {
                for (const item of items) {
                    const li = document.createElement("li");
                    li.textContent = item;
                    list.append(li);
                }
            }

            section.append(list);
        }

        countryDetails.append(section);
    }

}

countrySearch.addEventListener("input", () => {
    const query = countrySearch.value
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR");

    const filtered = countries.filter(country =>
        country.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("pt-BR")
            .includes(query)
    );

    renderCountryList(filtered);
});

loadCountries();
