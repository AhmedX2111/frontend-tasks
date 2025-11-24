// HttpClient class
class HttpClient {
  constructor(baseURL = "") {
    this.baseURL = baseURL;
  }

  request(method, endpoint, data = null, callback) {
    const xhr = new XMLHttpRequest();
    const url = this.baseURL + endpoint;

    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let response;
        try {
          response = xhr.responseText ? JSON.parse(xhr.responseText) : null;
        } catch (e) {
          response = xhr.responseText;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          callback(null, response);
        } else {
          callback(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`), null);
        }
      }
    };

    xhr.send(data ? JSON.stringify(data) : null);
  }

  get(endpoint, callback) {
    return this.request("GET", endpoint, null, callback);
  }

  post(endpoint, data, callback) {
    return this.request("POST", endpoint, data, callback);
  }

  put(endpoint, data, callback) {
    return this.request("PUT", endpoint, data, callback);
  }

  delete(endpoint, callback) {
    return this.request("DELETE", endpoint, null, callback);
  }
}

// UserService class
class UserService {
  constructor(baseURL = "https://jsonplaceholder.typicode.com") {
    this.baseURL = baseURL;
  }

  _request(method, endpoint, data = null, callback) {
    const xhr = new XMLHttpRequest();
    const url = this.baseURL + endpoint;

    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let response;
        try {
          response = xhr.responseText ? JSON.parse(xhr.responseText) : null;
        } catch (e) {
          response = xhr.responseText;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          callback(null, response);
        } else {
          callback(
            {
              status: xhr.status,
              message: xhr.statusText,
              data: response,
            },
            null
          );
        }
      }
    };

    xhr.onerror = function () {
      callback(new Error("Network error"), null);
    };

    xhr.send(data ? JSON.stringify(data) : null);
  }

  getAllUsers(callback) {
    this._request("GET", "/users", null, callback);
  }

  getUserById(id, callback) {
    this._request("GET", `/users/${id}`, null, callback);
  }

  createUser(userData, callback) {
    this._request("POST", "/users", userData, callback);
  }

  // Added: update (PUT) and delete (DELETE) for users
  updateUser(id, userData, callback) {
    this._request("PUT", `/users/${id}`, userData, callback);
  }

  deleteUser(id, callback) {
    this._request("DELETE", `/users/${id}`, null, callback);
  }

  getUserPosts(userId, callback) {
    this._request("GET", `/users/${userId}/posts`, null, callback);
  }
}

// ProductService class
class ProductService {
  constructor(baseURL = "https://fakestoreapi.com") {
    this.baseURL = baseURL;
  }

  _request(method, endpoint, data = null, callback) {
    const xhr = new XMLHttpRequest();
    const url = this.baseURL + endpoint;

    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let response;
        try {
          response = xhr.responseText ? JSON.parse(xhr.responseText) : null;
        } catch (e) {
          response = xhr.responseText;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          callback(null, response);
        } else {
          callback(
            {
              status: xhr.status,
              message: xhr.statusText,
              data: response,
            },
            null
          );
        }
      }
    };

    xhr.onerror = function () {
      callback(new Error("Network error"), null);
    };

    xhr.send(data ? JSON.stringify(data) : null);
  }

  getAllProducts(callback) {
    this._request("GET", "/products", null, callback);
  }

  getProductById(id, callback) {
    this._request("GET", `/products/${id}`, null, callback);
  }

  getCategories(callback) {
    this._request("GET", "/products/categories", null, callback);
  }

  getProductsByCategory(category, callback) {
    this._request("GET", `/products/category/${category}`, null, callback);
  }

  createProduct(productData, callback) {
    this._request("POST", "/products", productData, callback);
  }

  updateProduct(id, productData, callback) {
    this._request("PUT", `/products/${id}`, productData, callback);
  }

  deleteProduct(id, callback) {
    this._request("DELETE", `/products/${id}`, null, callback);
  }
}

// Create instances
const userService = new UserService();
const productService = new ProductService();

// Test functions for User Service
function testGetAllUsers() {
  const output = document.getElementById("userOutput");
  output.innerHTML = "🔄 Loading all users...";

  userService.getAllUsers(function (err, users) {
    if (err) {
      output.innerHTML = `<span class="error">❌ Error: ${
        err.message || err
      }</span>`;
    } else {
      output.innerHTML = `<span class="success">✅ Loaded ${users.length} users!</span><br><br>`;
      users.forEach((user) => {
        output.innerHTML += `👤 ${user.name} (${user.email})<br>`;
      });
    }
  });
}

function testGetUser1() {
  const output = document.getElementById("userOutput");
  output.innerHTML = "🔄 Loading user 1...";

  userService.getUserById(1, function (err, user) {
    if (err) {
      output.innerHTML = `<span class="error">❌ Error: ${
        err.message || err
      }</span>`;
    } else {
      output.innerHTML = `<span class="success">✅ User loaded!</span><br><br>
                        <strong>Name:</strong> ${user.name}<br>
                        <strong>Email:</strong> ${user.email}<br>
                        <strong>Phone:</strong> ${user.phone}<br>
                        <strong>Website:</strong> ${user.website}`;
    }
  });
}

function testCreateUser() {
  const output = document.getElementById("userOutput");
  output.innerHTML = "🔄 Creating new user...";

  const newUser = {
    name: "Trash Test User",
    email: "trash@test.com",
    phone: "123-456-7890",
    website: "trashtest.com",
  };

  userService.createUser(newUser, function (err, user) {
    if (err) {
      output.innerHTML = `<span class="error">❌ Error: ${
        err.message || err
      }</span>`;
    } else {
      output.innerHTML = `<span class="success">✅ User created! (fake API - not really saved)</span><br><br>
                        <strong>ID:</strong> ${user.id}<br>
                        <strong>Name:</strong> ${user.name}<br>
                        <strong>Email:</strong> ${user.email}`;
    }
  });
}

// Added: test update and delete for user
function testUpdateUser() {
  const output = document.getElementById("userOutput");
  output.innerHTML = "🔄 Updating user 1...";

  const updatedData = {
    name: "Trash Updated User",
    email: "updated@trash.com"
  };

  userService.updateUser(1, updatedData, function (err, user) {
    if (err) {
      output.innerHTML = `<span class="error">❌ Error: ${err.message || err}</span>`;
    } else {
      output.innerHTML = `<span class="success">✅ User updated! (fake API)</span><br><br>
                          <strong>ID:</strong> ${user.id || 1}<br>
                          <strong>Name:</strong> ${user.name || updatedData.name}<br>
                          <strong>Email:</strong> ${user.email || updatedData.email}`;
    }
  });
}

function testDeleteUser() {
  const output = document.getElementById("userOutput");
  output.innerHTML = "🔄 Deleting user 1...";

  userService.deleteUser(1, function (err, res) {
    if (err) {
      output.innerHTML = `<span class="error">❌ Error: ${err.message || err}</span>`;
    } else {
      output.innerHTML = `<span class="success">✅ User deleted! (fake API)</span><br><br>${JSON.stringify(res)}`;
    }
  });
}

function testUserPosts() {
  const output = document.getElementById("userOutput");
  output.innerHTML = "🔄 Loading user 1 posts...";

  userService.getUserPosts(1, function (err, posts) {
    if (err) {
      output.innerHTML = `<span class="error">❌ Error: ${
        err.message || err
      }</span>`;
    } else {
      output.innerHTML = `<span class="success">✅ Loaded ${posts.length} posts!</span><br><br>`;
      posts.forEach((post) => {
        output.innerHTML += `📝 ${post.title}<br>`;
      });
    }
  });
}

// Test functions for Product Service
function testGetAllProducts() {
  const output = document.getElementById("productOutput");
  output.innerHTML = "🔄 Loading all products...";

  productService.getAllProducts(function (err, products) {
    if (err) {
      output.innerHTML = `<span class="error">❌ Error: ${
        err.message || err
      }</span>`;
    } else {
      output.innerHTML = `<span class="success">✅ Loaded ${products.length} products!</span><br><br>`;
      products.slice(0, 5).forEach((product) => {
        output.innerHTML += `🛒 ${product.title} - $${product.price}<br>`;
      });
      if (products.length > 5) {
        output.innerHTML += `... and ${products.length - 5} more products`;
      }
    }
  });
}

function testGetProduct1() {
  const output = document.getElementById("productOutput");
  output.innerHTML = "🔄 Loading product 1...";

  productService.getProductById(1, function (err, product) {
    if (err) {
      output.innerHTML = `<span class="error">❌ Error: ${
        err.message || err
      }</span>`;
    } else {
      output.innerHTML = `<span class="success">✅ Product loaded!</span><br><br>
                        <strong>Title:</strong> ${product.title}<br>
                        <strong>Price:</strong> $${product.price}<br>
                        <strong>Category:</strong> ${product.category}<br>
                        <strong>Description:</strong> ${product.description.substring(
                          0,
                          100
                        )}...`;
    }
  });
}

function testGetCategories() {
  const output = document.getElementById("productOutput");
  output.innerHTML = "🔄 Loading categories...";

  productService.getCategories(function (err, categories) {
    if (err) {
      output.innerHTML = `<span class="error">❌ Error: ${
        err.message || err
      }</span>`;
    } else {
      output.innerHTML = `<span class="success">✅ Loaded ${categories.length} categories!</span><br><br>`;
      categories.forEach((category) => {
        output.innerHTML += `📁 ${category}<br>`;
      });
    }
  });
}

function testGetElectronics() {
  const output = document.getElementById("productOutput");
  output.innerHTML = "🔄 Loading electronics...";

  productService.getProductsByCategory("electronics", function (err, products) {
    if (err) {
      output.innerHTML = `<span class="error">❌ Error: ${
        err.message || err
      }</span>`;
    } else {
      output.innerHTML = `<span class="success">✅ Loaded ${products.length} electronics!</span><br><br>`;
      products.forEach((product) => {
        output.innerHTML += `📱 ${product.title} - $${product.price}<br>`;
      });
    }
  });
}

// Added: test create / update / delete for products
function testCreateProduct() {
  const output = document.getElementById("productOutput");
  output.innerHTML = "🔄 Creating new product...";

  const newProduct = {
    title: "Trash Gadget",
    price: 9.99,
    description: "A small trash gadget",
    category: "electronics",
    image: "https://placehold.it/150x150"
  };

  productService.createProduct(newProduct, function (err, product) {
    if (err) {
      output.innerHTML = `<span class="error">❌ Error: ${err.message || err}</span>`;
    } else {
      output.innerHTML = `<span class="success">✅ Product created! (fake API)</span><br><br>
                          <strong>ID:</strong> ${product.id}<br>
                          <strong>Title:</strong> ${product.title}<br>
                          <strong>Price:</strong> $${product.price}`;
    }
  });
}

function testUpdateProduct() {
  const output = document.getElementById("productOutput");
  output.innerHTML = "🔄 Updating product 1...";

  const updatedProduct = {
    title: "Updated Trash Gadget",
    price: 12.99
  };

  productService.updateProduct(1, updatedProduct, function (err, product) {
    if (err) {
      output.innerHTML = `<span class="error">❌ Error: ${err.message || err}</span>`;
    } else {
      output.innerHTML = `<span class="success">✅ Product updated! (fake API)</span><br><br>
                          <strong>ID:</strong> ${product.id || 1}<br>
                          <strong>Title:</strong> ${product.title || updatedProduct.title}<br>
                          <strong>Price:</strong> $${product.price || updatedProduct.price}`;
    }
  });
}

function testDeleteProduct() {
  const output = document.getElementById("productOutput");
  output.innerHTML = "🔄 Deleting product 1...";

  productService.deleteProduct(1, function (err, res) {
    if (err) {
      output.innerHTML = `<span class="error">❌ Error: ${err.message || err}</span>`;
    } else {
      output.innerHTML = `<span class="success">✅ Product deleted! (fake API)</span><br><br>${JSON.stringify(res)}`;
    }
  });
}

// Auto-run some tests when page loads
window.onload = function () {
  console.log("🚮 Trash website loaded! Testing services...");

  // Quick test to see if services work
  userService.getUserById(1, function (err, user) {
    if (err) {
      console.error("User service test failed:", err);
    } else {
      console.log("✅ User service works! User:", user.name);
    }
  });

  productService.getProductById(1, function (err, product) {
    if (err) {
      console.error("Product service test failed:", err);
    } else {
      console.log("✅ Product service works! Product:", product.title);
    }
  });
};
