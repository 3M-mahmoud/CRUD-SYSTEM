import React, { useState, useEffect, useCallback } from "react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    taxes: "",
    ads: "",
    discount: "",
    count: "",
    category: "",
  });
  const [total, setTotal] = useState("");
  const [mood, setMood] = useState("create");
  const [tempIndex, setTempIndex] = useState(null);
  const [searchMood, setSearchMood] = useState("title");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = useCallback(() => {
    const { price, taxes, ads, discount } = formData;
    if (price) {
      const result = +price + +taxes + +ads - +discount;
      setTotal(result);
    } else {
      setTotal("");
    }
  }, [formData]);

  useEffect(() => {
    calculateTotal();
  }, [
    formData.price,
    formData.taxes,
    formData.ads,
    formData.discount,
    calculateTotal,
  ]);

  const handleSubmit = () => {
    if (
      formData.title &&
      formData.price &&
      formData.category &&
      formData.count < 100
    ) {
      const newProduct = {
        id: Math.floor(Math.random() * 32423754),
        ...formData,
        total,
      };

      if (mood === "create") {
        if (
          products.find(
            (item) =>
              item?.title === newProduct.title &&
              item?.price === newProduct.price &&
              item?.category === newProduct.category
          ) === undefined
        ) {
          setProducts((prev) => [...prev, newProduct]);
          localStorage.setItem(
            "products",
            JSON.stringify([...products, newProduct])
          );
        } else {
          const data = products.map((item) => {
            if (item?.title === newProduct.title) {
              return { ...item, count: +item?.count + +newProduct.count };
            } else {
              return item;
            }
          });
          setProducts(data);
          localStorage.setItem("products", JSON.stringify(data));
        }
      } else {
        const updatedProducts = [...products];
        updatedProducts[tempIndex] = newProduct;
        setProducts(updatedProducts);
        setMood("create");
      }

      setFormData({
        title: "",
        price: "",
        taxes: "",
        ads: "",
        discount: "",
        count: "",
        category: "",
      });
      setTotal("");
    }
  };

  const handleDelete = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleUpdate = (index) => {
    setFormData(products[index]);
    setMood("update");
    setTempIndex(index);
  };

  const handleSearch = () => {
    if (searchMood === "title") {
      const data = products.filter((product) =>
        product.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilterProducts(data);
    } else {
      const data = products.filter((product) =>
        product.category.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilterProducts(data);
    }
  };
  const getSearch = (value) => {
    setSearchValue(value);
    handleSearch();
  };
  const handleIncrease = (id) => {
    const data = products.map((item) => {
      if (item.id === id) {
        return { ...item, count: +item.count + 1 };
      } else {
        return item;
      }
    });
    setProducts(data);
    localStorage.setItem("products", JSON.stringify(data));
  };
  const handleDecrease = (id, index) => {
    if (+products[index]?.count - 1 === 0) {
      handleDelete(id);
    } else {
      const data = products.map((item) => {
        if (item.id === id) {
          return { ...item, count: +item.count - 1 };
        } else {
          return item;
        }
      });
      setProducts(data);
      localStorage.setItem("products", JSON.stringify(data));
    }
  };
  const numbers =
    searchValue.length > 0
      ? filterProducts.reduce((acc, curr) => {
          return acc + +curr.count;
        }, 0)
      : products.reduce((acc, curr) => {
          return acc + +curr.count;
        }, 0);
  const totalPrice =
    searchValue.length > 0
      ? filterProducts.reduce((total, item) => {
          return total + +item.count * +item.price;
        }, 0)
      : products.reduce((total, item) => {
          return total + +item.count * +item.price;
        }, 0);
  return (
    <div className="crud">
      <div className="head">
        <h2>Cruds</h2>
        <p>Product Management System</p>
      </div>
      <div className="inputs">
        <input
          type="text"
          placeholder="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <div className="price">
          <input
            type="number"
            placeholder="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="taxes"
            name="taxes"
            value={formData.taxes}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="ads"
            name="ads"
            value={formData.ads}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
          />
          <span id="total" style={{ background: total ? "#00ff11" : "red" }}>
            {total && `Total: ${total}`}
          </span>
        </div>
        <input
          type="number"
          placeholder="count"
          name="count"
          value={formData.count}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>
          {mood === "create" ? "Create" : "Update"}
        </button>
      </div>
      <div className="outputs">
        <div className="search-container">
          <input
            type="text"
            placeholder={`Search By ${searchMood}`}
            value={searchValue}
            onChange={(e) => getSearch(e.target.value)}
          />
          <div className="search">
            <button onClick={() => setSearchMood("title")}>
              Search By Title
            </button>
            <button onClick={() => setSearchMood("category")}>
              Search By Category
            </button>
          </div>
        </div>
        <div className="custom">
          <div className="numbers">
            <p>Numbers = </p>
            <span>{numbers}</span>
          </div>
          <div className="numCategory">
            <p>Numbers_Category = </p>
            <span>
              {searchValue.length > 0 ? filterProducts.length : products.length}
            </span>
          </div>
          <div className="total">
            <p>Total_price = </p>
            <span>{(totalPrice / 1000).toFixed(3)}</span>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>title</th>
                <th>price</th>
                <th>total</th>
                <th>category</th>
                <th>count</th>
                <th>increase</th>
                <th>decrease</th>
                <th>update</th>
                <th>delete</th>
              </tr>
            </thead>
            <tbody>
              {searchValue.length > 0
                ? filterProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.title}</td>
                      <td>{product.price}</td>
                      <td>{product.price * product.count}</td>
                      <td>{product.category}</td>
                      <td>{product.count}</td>
                      <td>
                        <button
                          className="increase"
                          onClick={() => handleIncrease(product.id)}
                        >
                          +
                        </button>
                      </td>
                      <td>
                        <button
                          className="decrease"
                          onClick={() => handleDecrease(product.id, index)}
                        >
                          -
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleUpdate(index)}>
                          Update
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(product.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                : products.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.title}</td>
                      <td>{(product.price / 1000).toFixed(3)}</td>
                      <td>
                        {((product.price * product.count) / 1000).toFixed(3)}
                      </td>
                      <td>{product.category}</td>
                      <td>{product.count}</td>
                      <td>
                        <button
                          className="increase"
                          onClick={() => handleIncrease(product.id)}
                        >
                          +
                        </button>
                      </td>
                      <td>
                        <button
                          className="decrease"
                          onClick={() => handleDecrease(product.id, index)}
                        >
                          -
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleUpdate(index)}>
                          Update
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(product.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
