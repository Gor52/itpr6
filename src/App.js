import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import './App.css';

const Home = () => {
  return (
    <div className="page home-page">
      <div className="hero-section">
        <h2>Добро пожаловать в ресторан "Араратская долина"</h2>
        <p>Насладитесь подлинными вкусами армянской кухни в самом сердце города</p>
        <Link to="/menu" className="menu-button">Посмотреть меню</Link>
      </div>
      
      <div className="about-section">
        <h3>О нашем ресторане</h3>
        <p>
          "Араратская долина" - это место, где традиции армянской кухни встречаются 
          с современным подходом к обслуживанию. Наши повара готовят блюда по 
          старинным рецептам, передаваемым из поколения в поколение.
        </p>
      </div>
    </div>
  );
};

const Menu = ({ 
  dishes, 
  deleteDish, 
  activeTab, 
  setActiveTab
}) => {
  const categories = ['Все', 'Основные блюда', 'Закуски', 'Десерты', 'Напитки'];
  const filteredDishes = activeTab === 'Все' 
    ? dishes 
    : dishes.filter(dish => dish.category === activeTab);

  return (
    <div className="page menu-page">
      <div className="tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`tab ${activeTab === category ? 'active' : ''}`}
            onClick={() => setActiveTab(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="dishes-grid">
        {filteredDishes.map(dish => (
          <div key={dish.id} className="dish-card">
            {dish.image && (
              <div className="dish-image-container">
                <img src={dish.image} alt={dish.name} className="dish-image" />
              </div>
            )}
            <h3>{dish.name}</h3>
            <p>{dish.description}</p>
            <div className="dish-footer">
              <span className="price">{dish.price} ₽</span>
              <div className="actions">
                <Link to={`/edit/${dish.id}`} className="edit-button">Изменить</Link>
                <button onClick={() => deleteDish(dish.id)} className="delete-button">Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-dish-link">
        <Link to="/add" className="add-button">Добавить новое блюдо</Link>
      </div>
    </div>
  );
};

const DishForm = ({ dishes, addDish, editDish }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const currentDish = isEditing 
    ? dishes.find(dish => dish.id === Number(id)) 
    : null;

  const [dish, setDish] = useState(
    currentDish || {
      name: '',
      description: '',
      price: '',
      category: 'Основные блюда',
      image: ''
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDish(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dish.name || !dish.price) {
      alert('Пожалуйста, заполните обязательные поля (Название и Цена)');
      return;
    }
    
    if (isEditing) {
      editDish({ ...dish, id: Number(id) });
    } else {
      addDish({ ...dish, id: Date.now(), price: Number(dish.price) });
    }
    
    navigate('/menu');
  };

  return (
    <div className="page">
      <div className="dish-form-container">
        <h2>{isEditing ? 'Редактировать блюдо' : 'Добавить новое блюдо'}</h2>
        <form onSubmit={handleSubmit}>
          {dish.image && (
            <div className="image-preview-container">
              <img src={dish.image} alt="Предпросмотр" className="image-preview" />
            </div>
          )}
          <input
            type="text"
            name="image"
            placeholder="URL изображения"
            value={dish.image}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="name"
            placeholder="Название блюда"
            value={dish.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Описание блюда"
            value={dish.description}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Цена"
            value={dish.price}
            onChange={handleInputChange}
            required
            min="0"
          />
          <select
            name="category"
            value={dish.category}
            onChange={handleInputChange}
          >
            <option value="Основные блюда">Основные блюда</option>
            <option value="Закуски">Закуски</option>
            <option value="Десерты">Десерты</option>
            <option value="Напитки">Напитки</option>
          </select>
          <div className="form-buttons">
            <button type="submit" className="submit-button">
              {isEditing ? 'Сохранить изменения' : 'Добавить блюдо'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/menu')}
              className="cancel-button"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [dishes, setDishes] = useState(() => {
    const savedDishes = localStorage.getItem('restaurantDishes');
    return savedDishes ? JSON.parse(savedDishes) : [
      { 
        id: 1, 
        name: 'Хоровац', 
        description: 'Армянский шашлык из свинины с овощами на гриле', 
        price: 1200, 
        category: 'Основные блюда',
        image: 'https://cdn.lifehacker.ru/wp-content/uploads/2019/04/Depositphotos_191279212_xl-2015_1556605737-e1556605841233-630x315.jpg' 
      },
      { 
        id: 2, 
        name: 'Долма', 
        description: 'Виноградные листья с мясной начинкой и ароматными специями', 
        price: 950, 
        category: 'Основные блюда',
        image: 'https://aif-s3.aif.ru/images/015/673/7ccde42ab56c82cc9634cd20e3727bf7.jpg'
      },
      { 
        id: 3, 
        name: 'Гата', 
        description: 'Традиционная армянская слоеная выпечка с начинкой', 
        price: 350, 
        category: 'Десерты',
        image: 'https://kamelena.com/uploads/recipes/500/531/f531-gata.jpg'
      },
      { 
        id: 4, 
        name: 'Тан', 
        description: 'Освежающий кисломолочный напиток с мятой', 
        price: 200, 
        category: 'Напитки',
        image: 'https://img.iamcook.ru/howto/preview/485767f36d4f97ebcbb00415e8e2dd6b.jpg'
      },
      { 
        id: 5, 
        name: 'Женгялов хац', 
        description: 'Армянский лепешка с зеленью и сыром', 
        price: 450, 
        category: 'Закуски',
        image: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Jengyal_roll_%E2%80%94_%D4%BA%D5%A5%D5%B6%D5%A3%D5%B5%D5%A1%D5%AC%D5%B8%D5%BE_%D5%B0%D5%A1%D6%81.jpg'
      },
      { 
        id: 6, 
        name: 'Хашлама', 
        description: 'Армянское тушеное мясо с овощами', 
        price: 850, 
        category: 'Основные блюда',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/%D0%92%D0%BA%D1%83%D1%81%D0%BD%D0%B0%D1%8F_%D1%85%D0%B0%D1%88%D0%BB%D0%B0%D0%BC%D0%B0.jpg/1200px-%D0%92%D0%BA%D1%83%D1%81%D0%BD%D0%B0%D1%8F_%D1%85%D0%B0%D1%88%D0%BB%D0%B0%D0%BC%D0%B0.jpg'
      },
      { 
        id: 7, 
        name: 'Пахлава', 
        description: 'Слоеный десерт с орехами и медом', 
        price: 400, 
        category: 'Десерты',
        image: 'https://menunedeli.ru/wp-content/uploads/2015/09/16-kl-pahlava.jpg'
      },
      { 
        id: 8, 
        name: 'Ариса', 
        description: 'Армянская куриная каша с пшеницей', 
        price: 650, 
        category: 'Основные блюда',
        image: 'https://krealikum.ru/wp-media/arisa-harisa-1200x675.jpg'
      }
    ];
  });

  const [activeTab, setActiveTab] = useState('Все');

  useEffect(() => {
    localStorage.setItem('restaurantDishes', JSON.stringify(dishes));
  }, [dishes]);

  const addDish = (dish) => {
    setDishes([...dishes, dish]);
  };

  const editDish = (updatedDish) => {
    setDishes(dishes.map(dish => 
      dish.id === updatedDish.id ? updatedDish : dish
    ));
  };

  const deleteDish = (id) => {
    setDishes(dishes.filter(dish => dish.id !== id));
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <h1>Ресторан "Араратская долина"</h1>
            <nav>
              <Link to="/" className="nav-link">Главная</Link>
              <Link to="/menu" className="nav-link">Меню</Link>
            </nav>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={
              <Menu 
                dishes={dishes}
                deleteDish={deleteDish}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            } />
            <Route path="/add" element={
              <DishForm 
                dishes={dishes}
                addDish={addDish}
              />
            } />
            <Route path="/edit/:id" element={
              <DishForm 
                dishes={dishes}
                editDish={editDish}
              />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;