import React, { useState } from "react";
import axios from "axios";
import deleteIcon from "../assets/delete.svg";
import closeIcon from "../assets/close.svg";
import foodIcon from "../assets/food.svg";
import ingredientsIcon from "../assets/ingredients.svg";

function Main() {
  const [ingredients, setIngredients] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipeInfo, setSelectedRecipeInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const newIngredient = formData.get("ingredient").toLowerCase().trim();
    formElement.reset();
    if (newIngredient && !ingredients.includes(newIngredient)) {
      setIngredients((prev) => [...prev, newIngredient]);
    }
  }

  function handleDelete(ingredient) {
    setTimeout(() => {
      setIngredients((prev) => prev.filter((i) => i !== ingredient));
    }, 150);
  }

  async function searchRecipes(ingredients) {
    if (!ingredients.length) {
      setFilteredRecipes([]);
      return;
    }

    setLoading(true);
    const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
    const query = ingredients.join(",");

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients`,
        {
          params: {
            ingredients: query,
            number: 10,
            apiKey,
          },
        }
      );
      setFilteredRecipes(response.data);
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
      alert("Erro ao buscar receitas.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecipeInfo(id) {
    setLoading(true);
    const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information`,
        {
          params: { apiKey },
        }
      );
      setSelectedRecipeInfo(response.data);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      alert("Error to load details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center bg-neumorph m-8 p-6">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">
        Let's cook together?
      </h1>
      <h1 className="text-xl font-semibold text-gray-700 mb-6">
        Search your recipe!
      </h1>

      <form onSubmit={handleSubmit} className="flex justify-center gap-4">
        <input
          name="ingredient"
          placeholder=""
          className="neu-input"
          required
        />
        <button className="p-4 btn-primary rounded-2xl">Add</button>
      </form>

      <ul className="mx-40 mt-8 flex flex-row flex-wrap items-center justify-start gap-4">
        {ingredients.map((ingredient) => (
          <li
            key={ingredient}
            className="w-70 p-6 flex justify-between items-center text-lg bg-neumorph"
          >
            {ingredient}
            <button
              className="icon-btn"
              onClick={() => handleDelete(ingredient)}
            >
              <img src={deleteIcon} alt="Delete" />
            </button>
          </li>
        ))}
      </ul>

      <button
        className="btn-primary my-10 w-50 p-4 rounded-2xl"
        onClick={() => searchRecipes(ingredients)}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {selectedRecipeInfo ? (
        <div className="flex flex-col items-center w-full p-4 gap-6 mb-4 bg-neumorph">
          <h2 className="text-2xl font-bold mb-2">
            {selectedRecipeInfo.title}
          </h2>
          <img
            src={selectedRecipeInfo.image}
            alt={selectedRecipeInfo.title}
            className="rounded-xl w-60 h-auto mb-4"
          />

          <div className="text-left px-4 w-full max-w-xl">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <img src={foodIcon} alt="" className="w-6" />
              Ingredients:
            </h3>
            <ul className="list-disc ml-5">
              {selectedRecipeInfo.extendedIngredients.map((ing, i) => (
                <li key={i}>{ing.original}</li>
              ))}
            </ul>
          </div>

          <div className="text-left px-4 w-full max-w-xl">
            <h3 className="font-semibold mt-6 mb-2 flex items-center gap-2">
              <img src={ingredientsIcon} alt="" className="w-6" />
              Instructions:
            </h3>
            <div
              className="text-base leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  selectedRecipeInfo.instructions ||
                  "Instructions not avaliable.",
              }}
            />
          </div>

          <button onClick={() => setSelectedRecipeInfo(null)}>
            <img src={closeIcon} className="w-10 icon-btn" alt="Fechar" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full rounded-2xl gap-8 p-8 bg-neumorph">
          <h2 className="text-2xl">Recipes found:</h2>
          <ul className="gap-4 flex flex-col w-full max-w-xl">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <li
                  key={recipe.id}
                  onClick={() => {
                    setTimeout(() => {
                      fetchRecipeInfo(recipe.id);
                    }, 150);
                  }}
                  className="bg-neumorph p-4 text-center text-2xl cursor-pointer"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-20 h-20 rounded-xl"
                    />
                    <div className="text-start">
                      <p className="text-xl font-semibold">{recipe.title}</p>
                      <p className="text-sm text-gray-500">
                        {recipe.usedIngredientCount} used ingredient(s)
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center">No recipes found.</p>
            )}
          </ul>
        </div>
      )}
    </main>
  );
}

export default Main;
