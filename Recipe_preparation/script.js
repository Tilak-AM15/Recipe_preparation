const recipeList = document.getElementById("recipeList");
const searchBox = document.getElementById("search");

// Local Indian breakfast/popular recipes
const localRecipes = [
  {
    name:"Dosa",
    image:"dosa.jpg",
    category:"Breakfast",
    area:"Indian",
    ingredients:["Rice - 2 cups","Urad dal - 1 cup","Water - as needed","Oil - 2 tbsp"],
    instructions:"1. Soak rice and dal for 4-5 hrs.\n2. Grind to smooth batter.\n3. Ferment overnight.\n4. Pour batter on pan, cook till crisp."
  },
  {
    name:"Idli",
    image:"idli.jpg",
    category:"Breakfast",
    area:"Indian",
    ingredients:["Rice - 2 cups","Urad dal - 1 cup","Salt - 1 tsp","Water - as needed"],
    instructions:"1. Soak rice and dal for 4-5 hrs.\n2. Grind to smooth batter.\n3. Ferment overnight.\n4. Pour into idli molds, steam for 10-15 mins."
  },
  {
    name:"Upma",
    image:"upma.jpg",
    category:"Breakfast",
    area:"Indian",
    ingredients:["Rava/Semolina - 1 cup","Water - 2 cups","Onion - 1","Oil - 2 tbsp","Spices - as needed"],
    instructions:"1. Roast rava lightly.\n2. Sauté onion & spices.\n3. Add water, bring to boil.\n4. Add rava, cook till fluffy."
  },
  {
    name:"Poha",
    image:"poha.jpg",
    category:"Breakfast",
    area:"Indian",
    ingredients:["Flattened Rice - 2 cups","Onion - 1","Green chili - 1","Lemon - 1","Spices - as needed"],
    instructions:"1. Rinse poha.\n2. Cook onion, chili & spices.\n3. Add poha, mix, garnish with lemon."
  },
  {
    name:"Paratha",
    image:"parattha.jpg",
    category:"Breakfast",
    area:"Indian",
    ingredients:["Wheat Flour - 2 cups","Water - as needed","Oil - 2 tbsp","Salt - 1 tsp"],
    instructions:"1. Prepare dough.\n2. Roll into flatbreads.\n3. Cook on pan with oil till golden brown."
  },
  {
    name:"Pav Bhaji",
    image:"pavbhajji.jpg",
    category:"Snack",
    area:"Indian",
    ingredients:["Pav - 4","Mixed Vegetables - 2 cups","Butter - 2 tbsp","Spices - as needed"],
    instructions:"1. Cook mashed veggies with spices.\n2. Toast pav with butter.\n3. Serve hot with onion & lemon."
  }
];

// Fetch meals from MealDB API
async function fetchMeals(query){
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await res.json();
  return data.meals || [];
}

// Fetch drinks from CocktailDB API
async function fetchDrinks(query){
  const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await res.json();
  return data.drinks || [];
}

// Render cards
function displayRecipes(meals, drinks){
  recipeList.innerHTML = "";

  const combined = [...localRecipes, ...meals.map(meal=>{
    const ingredients=[];
    for(let i=1;i<=20;i++){
      if(meal[`strIngredient${i}`]) ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    }
    return {
      name: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      ingredients,
      instructions: meal.strInstructions
    };
  }), ...drinks.map(drink=>{
    const ingredients=[];
    for(let i=1;i<=15;i++){
      if(drink[`strIngredient${i}`]) ingredients.push(`${drink[`strIngredient${i}`]} - ${drink[`strMeasure${i}`] || ""}`);
    }
    return {
      name: drink.strDrink,
      image: drink.strDrinkThumb,
      category: drink.strCategory,
      area: drink.strGlass,
      ingredients,
      instructions: drink.strInstructions
    };
  })];

  combined.forEach(item=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <img src="${item.image}" alt="${item.name}">
      <div class="card-content">
        <h2>${item.name}</h2>
        <button onclick="toggleDetails(this)">View Recipe</button>
        <div class="details">
          <p><b>Category:</b> ${item.category}</p>
          <p><b>Area/Glass:</b> ${item.area}</p>
          <p><b>Ingredients:</b><br>${item.ingredients.join("<br>")}</p>
          <p><b>Instructions:</b><br>${item.instructions}</p>
        </div>
      </div>
    `;
    recipeList.appendChild(card);
  });
}

// Toggle details
function toggleDetails(button){
  const details = button.nextElementSibling;
  details.style.display = details.style.display === "block" ? "none" : "block";
}

// Search functionality
searchBox.addEventListener("keyup", async ()=>{
  const keyword=searchBox.value.trim();
  if(keyword.length>0){
    const [meals, drinks] = await Promise.all([fetchMeals(keyword), fetchDrinks(keyword)]);
    displayRecipes(meals, drinks);
  } else {
    displayRecipes([], [], []);
  }
});

// Initial load
(async()=>{
  const [meals, drinks]=await Promise.all([fetchMeals("cake"), fetchDrinks("tea")]);
  displayRecipes(meals, drinks);
})();