import { useState, useEffect } from 'react'
import './App.css'
import { textH3Add, textH3Del, textH3Check } from './helper/text';

function App() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [checkedItems, setCheckedItems] = useState([]);
  const URL = 'https://gieo5t0end.execute-api.eu-west-1.amazonaws.com';

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(URL + '/items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items :', error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const addItem = async () => {
    console.log("add items");
    try {
      const response = await fetch(URL + '/items', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: "52", items: inputValue }),
      });
      if (!response.ok) {
        throw new Error('Failed to add item');
      }
      fetchItems();
      setInputValue('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(URL + `/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleChecked = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((itemId) => itemId !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <h2>Instruction de l'application: </h2>
      <h3>{textH3Add}</h3>
      <h3>{textH3Del}</h3>
      <h3>{textH3Check}</h3>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Ajouter une nouvelle tâche"
      />
      <button onClick={addItem}>Ajout</button>
      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ textDecoration: checkedItems.includes(item.id) ? 'line-through' : 'none' }}
            onClick={() => toggleChecked(item.id)}
          >
            {item.items}
            <button onClick={() => deleteItem(item.id)}>Suppression</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
