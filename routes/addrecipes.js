const form = document.getElementById("recipeForm");
const list = document.getElementById("recipeList");

// Load from localStorage on page load
window.onload = () => {
  const saved = JSON.parse(localStorage.getItem("recipes")) || [];
  saved.forEach(addRecipeToDOM);
};

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("recipeName").value.trim();
  const instructions = document.getElementById("recipeInstructions").value.trim();
  const image = document.getElementById("recipeImage").value.trim();
  const category = document.getElementById("recipeCategory").value;

  if (!name || !instructions || !category) return;

  const recipe = { name, instructions, image, category };
  addRecipeToDOM(recipe);
  saveToLocal(recipe);

  form.reset();
});

function addRecipeToDOM(recipe) {
  const div = document.createElement("div");
  div.className = "recipe";
  div.innerHTML = `
    <h2>${recipe.name}</h2>
    <div class="category">Category: ${recipe.category}</div>
    <p>${recipe.instructions.replace(/\n/g, "<br>")}</p>
    ${recipe.image ? `<img src="${recipe.image}" alt="Recipe Image">` : ""}
  `;
  list.appendChild(div);
}

function saveToLocal(recipe) {
  const saved = JSON.parse(localStorage.getItem("recipes")) || [];
  saved.push(recipe);
  localStorage.setItem("recipes", JSON.stringify(saved));
}
