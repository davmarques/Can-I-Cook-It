import React, { useState } from "react"
import receitas from '../recipes.json';


function Main() {
    const [ingredients, setIngredients] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null)

    function handleSubmit(event) {
        event.preventDefault()
        const formElement = event.currentTarget
        const formData = new FormData(formElement)
        const newIngredient = formData.get("ingredient")
        formElement.reset()
        if (newIngredient && !ingredients.includes(newIngredient)) {
            setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
        }
    }

    function searchRecipes(ingredients) {
        if (!ingredients.length) {
            alert("Adicione pelo menos um ingrediente para buscar receitas!");
            setFilteredRecipes([])
            return;
        }
        setLoading(true);

        const normalizedIngredients = ingredients.map(ingredient => ingredient.toLowerCase().trim());

        const filteredRecipes = receitas.filter(receita => {
            const normalizedRecipeIngredients = receita.ingredientes.map(ingrediente => ingrediente.toLowerCase().trim());
            return normalizedIngredients.every(ingredient => normalizedRecipeIngredients.includes(ingredient));
        });
        setFilteredRecipes(filteredRecipes);
        setLoading(false);
        console.log(filteredRecipes)
    }



const ingredientsListItems = ingredients.map(ingredient => (
    <li className="ingredient-list" key={ingredient}>
        {ingredient}
        <button className="delete-button" onClick={() => handleDelete(ingredient)}>- Excluir</button>
    </li>
))

function handleDelete(ingredient) {
    setIngredients(prevIngredients => prevIngredients.filter(i => i !== ingredient))
}

return (
    <main>
        <form onSubmit={handleSubmit} className="add-ingredient-form">
            <input name="ingredient" placeholder="Adicionar um ingrediente" required />
            <button >Adicionar</button>
        </form>
        <ul>
            {ingredientsListItems}
        </ul>

        <button className="search-button" onClick={() => searchRecipes(ingredients)} disabled={loading}>
            {loading ? "Buscando..." : "Buscar Receitas"}
        </button>

        {selectedRecipe ? (
            <div className="recipe-details">
                <h2>{selectedRecipe.nome || "Receita sem nome"}</h2>
                <p><strong>Ingredientes: </strong>{selectedRecipe.ingredientes.join(", ") || "Sem ingredientes"}</p>
                <p><strong>Modo de preparo: </strong> {selectedRecipe.preparo || "Não disponível"}</p>
                <button onClick={() => setSelectedRecipe(null)}>Fechar</button>
            </div>
        ) : (
            <div className="filtered-recipes">
                <h2>Receitas Encontradas:</h2>
                <ul>
                    {filteredRecipes.length > 0 ? filteredRecipes.map((recipe, index) => (
                        <li key={index} onClick={() => setSelectedRecipe(recipe)} style={{ cursor: "pointer" }}>
                            {recipe.nome || "Sem nome"}
                        </li>
                    )) : (
                        <p>Nenhuma receita encontrada.</p>
                    )}
                </ul>
            </div>
        )}
    </main>
)
}

export default Main

// buscar por palavras chave
// buscar por nome
// Mostrar ingrediente com letra maiuscula
// buscar sem necessidade de acento ou ç
// insercao de receita
//Adicionar filtros de temperatura, doce ou salgado, bebida, sobremesa, 