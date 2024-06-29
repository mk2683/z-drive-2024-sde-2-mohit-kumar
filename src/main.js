const URL = "https://restcountries.com/v3.1/all";
const ROWPERPAGE = 5;
const BTNSPERPAGE = 5;
// console.log("Hi");

document.addEventListener("DOMContentLoaded", () => {
  let countryData;
  let currentPage = 1;

  const table = document.getElementById("datatable");
  const thead = table.querySelector("thead tr");
  const tbody = document.querySelector("tbody");
  const pagination = document.querySelector("#pagination");

  const coulumns = [
    {
      key: "name.common",
      label: "Common Name",
      sortable: true,
      filterable: true,
    },
    {
      key: "region",
      label: "region",
      sortable: false,
      filterable: false,
    },
    {
      key: "subregion",
      label: "subregion",
      sortable: false,
      filterable: false,
    },
    {
      key: "population",
      label: "population",
      sortable: true,
      filterable: false,
    },
    {
      key: "capital",
      label: "capital",
      sortable: true,
      filterable: true,
    },
  ];

  function getKeyValue(obj, key) {
    const keys = key.split(".");
    let result = obj;

    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return "";
      }
    }

    return result;
  }

  function renderTable(data) {
    tbody.innerHTML = "";

    const start = (currentPage - 1) * ROWPERPAGE;
    const end = start + ROWPERPAGE;
    const currentPageData = data.slice(start, end);

    const rowFragment = document.createDocumentFragment();

    currentPageData.forEach((country) => {
      const tr = document.createElement("tr");

      coulumns.forEach((col) => {
        const td = document.createElement("td");
        td.textContent = getKeyValue(country, col.key);
        tr.appendChild(td);
      });

      rowFragment.appendChild(tr);
    });

    tbody.appendChild(rowFragment);
  }

  function renderHeader(data) {
    thead.innerHTML = "";

    const headFragment = document.createDocumentFragment();
    coulumns.forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col.label;

      if (col.sortable) {
        th.classList.add("sortable");

        th.addEventListener("click", () => {
          console.log("Sort");
          sortTable(data, col.key);
        });
      }

      headFragment.append(th);
    });

    thead.appendChild(headFragment);
  }

  function sortTable(data, key) {
    const sortedData = data.sort((a, b) => {
      const valA = getKeyValue(a, key);
      const valB = getKeyValue(b, key);
      if (valA > valB) return 1;
      if (valA < valB) return -1;

      return 0;
    });

    renderTable(sortedData);
  }

  function renderPagination(totalRows) {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(totalRows / ROWPERPAGE);

    const btnFragments = document.createDocumentFragment();

    for (let i = 1; i < totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;

      if (i === currentPage) {
        btn.disabled = true;
      }

      btn.addEventListener("click", () => {
        currentPage = i;
        renderTable(countryData);
        renderPagination(totalRows);
      });
      btnFragments.appendChild(btn);
    }

    pagination.appendChild(btnFragments);
  }

  async function loadData(url) {
    const data = await fetch(url);
    const result = await data.json();
    countryData = result;
    renderHeader(result);
    renderTable(result);
    renderPagination(result.length);
  }

  loadData(URL);
});
