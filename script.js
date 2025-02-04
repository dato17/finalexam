const tbody = document.querySelector("#news-table tbody");
const burger = document.querySelector(".burger");
const actBurgerCon = document.querySelector(".act-burger-con");
const form = document.querySelector("#news-form");

document.addEventListener("DOMContentLoaded", () => {
  // click function to open burger bar
  if (burger && actBurgerCon) {
    burger.addEventListener("click", () => {
      actBurgerCon.style.display =
        actBurgerCon.style.display === "flex" ? "none" : "flex";
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      const title = document.querySelector("#title").value;
      const category = document.querySelector("#category").value;
      const likes = document.querySelector("#likes").value;
      const editorFirstName = document.querySelector("#editor-firstName").value;
      const editorLastName = document.querySelector("#editor-lastName").value;

      event.preventDefault();

      const newsList = JSON.parse(localStorage.getItem("newsList")) || [];

      const newNews = {
        id: Date.now(),
        title,
        category,
        likes,
        editorFirstName,
        editorLastName,
        dateCreated: new Date().toLocaleString(),
        dateUpdated: new Date().toLocaleString(),
      };

      newsList.push(newNews);

      localStorage.setItem("newsList", JSON.stringify(newsList));

      window.location.href = "index.html";
    });
  }

  // Fetch data save in localStorage and draw
  function drawData() {
    const localNews = JSON.parse(localStorage.getItem("newsList")) || [];
    let newsList = [...localNews];

    // Show loading message
    if (tbody) {
      tbody.innerHTML =
        '<tr><td colspan="7" class="loading">Loading...</td></tr>';
    }

    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => {
        newsList = [...data.slice(0, 10), ...localNews];

        if (tbody) {
          tbody.innerHTML = "";

          newsList.forEach((news, index) => {
            const row = tbody.insertRow();

            row.innerHTML = `
              <tr>
                <td>${index + 1}</td>
                <td>${news.title || "N/A"}</td>
                <td>${news.category || "General"}</td>
                <td>${news.likes || 0}</td>
                <td>${news.dateUpdated || "0:00:00"}</td>
                <td>${news.dateCreated || "0:00:00"}</td>
                <td>
              <button class="delete-btn" onclick="deleteLists(${
                news.id
              }, this)">Delete</button>
                  <button class="update-btn" onclick="toUpdate(${
                    news.id
                  })">Update</button>
                </td>
              </tr>
            `;
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  drawData();
});

// filter list to remove item by id
function deleteLists(id, button) {
  const row = button.closest("tr");

  let newsList = JSON.parse(localStorage.getItem("newsList")) || [];
  newsList = newsList.filter((news) => news.id !== id);
  localStorage.setItem("newsList", JSON.stringify(newsList));

  row.remove();
}

deleteLists();