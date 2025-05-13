import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const Menu = ({ 
  dishes, 
  newDish, 
  editingId, 
  handleInputChange, 
  addDish, 
  editDish, 
  deleteDish, 
  activeTab, 
  setActiveTab,
  cancelEdit
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
            <h3>{dish.name}</h3>
            <p>{dish.description}</p>
            <div className="dish-footer">
              <span className="price">{dish.price} ₽</span>
              <div className="actions">
                <button onClick={() => editDish(dish)} className="edit-button">Изменить</button>
                <button onClick={() => deleteDish(dish.id)} className="delete-button">Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-dish-form">
        <h2>{editingId ? 'Редактировать блюдо' : 'Добавить новое блюдо'}</h2>
        <input
          type="text"
          name="name"
          placeholder="Название блюда"
          value={newDish.name}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Описание блюда"
          value={newDish.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Цена"
          value={newDish.price}
          onChange={handleInputChange}
          required
          min="0"
        />
        <select
          name="category"
          value={newDish.category}
          onChange={handleInputChange}
        >
          <option value="Основные блюда">Основные блюда</option>
          <option value="Закуски">Закуски</option>
          <option value="Десерты">Десерты</option>
          <option value="Напитки">Напитки</option>
        </select>
        <button onClick={addDish} className="add-button">
          {editingId ? 'Сохранить изменения' : 'Добавить блюдо'}
        </button>
        {editingId && (
          <button 
            onClick={cancelEdit}
            className="cancel-button"
          >
            Отмена
          </button>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [dishes, setDishes] = useState([]);
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Основные блюда'
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('Все');

  useEffect(() => {
    const sampleDishes = [
      { id: 1, name: 'Хоровац', description: 'Армянский шашлык из свинины', price: 1200, category: 'Основные блюда' },
      { id: 2, name: 'Долма', description: 'Виноградные листья с мясной начинкой', price: 950, category: 'Основные блюда' },
      { id: 3, name: 'Гата', description: 'Традиционная армянская выпечка', price: 350, category: 'Десерты' },
      { id: 4, name: 'Тан', description: 'Освежающий кисломолочный напиток', price: 200, category: 'Напитки' }
    ];
    setDishes(sampleDishes);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDish(prev => ({ ...prev, [name]: value }));
  };

  const addDish = () => {
    if (!newDish.name || !newDish.price) {
      alert('Пожалуйста, заполните обязательные поля (Название и Цена)');
      return;
    }
    
    if (editingId) {
      setDishes(dishes.map(dish => 
        dish.id === editingId ? { ...newDish, id: editingId } : dish
      ));
      setEditingId(null);
    } else {
      const dish = { ...newDish, id: Date.now(), price: Number(newDish.price) };
      setDishes([...dishes, dish]);
    }
    
    setNewDish({ name: '', description: '', price: '', category: 'Основные блюда' });
  };

  const editDish = (dish) => {
    setNewDish(dish);
    setEditingId(dish.id);
  };

  const deleteDish = (id) => {
    setDishes(dishes.filter(dish => dish.id !== id));
    if (editingId === id) {
      cancelEdit();
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewDish({ name: '', description: '', price: '', category: 'Основные блюда' });
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <h1>Ресторан "Араратская долина"</h1>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={
              <Menu 
                dishes={dishes}
                newDish={newDish}
                editingId={editingId}
                handleInputChange={handleInputChange}
                addDish={addDish}
                editDish={editDish}
                deleteDish={deleteDish}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                cancelEdit={cancelEdit}
              />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};
export default App;