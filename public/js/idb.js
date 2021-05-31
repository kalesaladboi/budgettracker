let db;
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('budget_item', { autoIncrement: true });
  };

request.onsuccess = function(event) {
    db = event.target.result;
  
    if (navigator.onLine) {

      updateBudget();
    }
  };
  
  request.onerror = function(event) {
    console.log(event.target.errorCode);
  };

function saveRecord(record) {
    const transaction = db.transaction(['budget_item'], 'readwrite');
  
    const budgetObjectStore = transaction.objectStore('budget_item');
  
    budgetObjectStore.add(record);
  }

  function updateBudget() {
    const transaction = db.transaction(['budget_item'], 'readwrite');
  
    const budgetObjectStore = transaction.objectStore('budget_item');
  
    const getAll = budgetObjectStore.getAll();
  
getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          const transaction = db.transaction(['budget_item'], 'readwrite');
          const budgetObjectStore = transaction.objectStore('budget_item');
          budgetObjectStore.clear();

          alert('All saved budget items has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  }

window.addEventListener('online', updateBudget);