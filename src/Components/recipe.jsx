import { useState } from "react";

export default function Recipe() {
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState([]);
  const [selected, setSelected] = useState(null);

  const search = async () => {
    if (!query) return;
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();
    setMeals(data.meals || []);
  };

  const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
      }
    }
    return ingredients;
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-10 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            🍳 Recipe Book
          </h1>
          <p className="text-gray-600 text-lg">Discover delicious recipes from around the world</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-12 max-w-2xl mx-auto shadow-lg">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && search()}
            placeholder="Search for recipes... (e.g., chicken, pasta, cake)"
            className="flex-1 px-6 py-4 border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-lg"
          />
          <button 
            onClick={search} 
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all shadow-lg"
          >
            Search
          </button>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {meals.map((meal) => (
            <div 
              key={meal.idMeal} 
              onClick={() => setSelected(meal)} 
              className="bg-white rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={meal.strMealThumb} 
                  alt={meal.strMeal} 
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-orange-600">
                  {meal.strCategory}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{meal.strMeal}</h3>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <span>🌍</span>
                  <span>{meal.strArea}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {meals.length === 0 && query && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No recipes found. Try another search! 🔍</p>
          </div>
        )}

        {/* Modal for Recipe Details */}
        {selected && (
          <div 
            onClick={() => setSelected(null)} 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5 z-[999]"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelected(null)} 
                className="sticky top-4 float-right mr-4 z-10 bg-red-500 hover:bg-red-600 text-white border-none text-2xl cursor-pointer rounded-full w-12 h-12 shadow-lg transition-all hover:scale-110"
              >
                ✕
              </button>
              
              {/* Recipe Image */}
              <img 
                src={selected.strMealThumb} 
                alt={selected.strMeal} 
                className="w-full h-80 object-cover" 
              />
              
              <div className="p-8">
                {/* Recipe Title */}
                <h2 className="text-4xl font-bold text-gray-800 mb-3">{selected.strMeal}</h2>
                
                {/* Category & Area Badges */}
                <div className="flex gap-3 mb-8">
                  <span className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full text-sm font-semibold shadow-md">
                    {selected.strCategory}
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full text-sm font-semibold shadow-md">
                    🌍 {selected.strArea}
                  </span>
                </div>
                
                {/* Video Section */}
                {selected.strYoutube && (
                  <div className="mb-8 bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border-2 border-red-200 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      🎥 Video Tutorial
                    </h3>
                    <div className="relative w-full aspect-video">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
                        src={getYoutubeEmbedUrl(selected.strYoutube)}
                        title={selected.strMeal}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
                
                {/* Ingredients Card */}
                <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-300 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    📝 Ingredients
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getIngredients(selected).map((ing, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <span className="text-green-600 text-xl">✓</span>
                        <span className="text-gray-700">{ing}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Instructions Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-300 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    👨‍🍳 Cooking Instructions
                  </h3>
                  <div className="bg-white p-5 rounded-xl shadow-sm">
                    <p className="whitespace-pre-line leading-relaxed text-gray-700">{selected.strInstructions}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
