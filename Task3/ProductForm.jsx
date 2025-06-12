import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductForm.css';


const ProductForm = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const isEdit = !!id; 

    const handleBack = () => {
        navigate('/');
    };

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (isEdit) {
            fetch(`http://localhost:3000/products/${id}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        name: data.name,
                        price: data.price,
                        category: data.category,
                        description: data.description
                    });
                })
                .catch(() => alert('Product not found!'));
        }
    }, [id]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.price) newErrors.price = 'Price is required';
        else if (isNaN(formData.price)) newErrors.price = 'Price must be a number';
        return newErrors;
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setLoading(true);

        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `http://localhost:3000/products/${id}` : `http://localhost:3000/products`;

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(() => {
                alert(isEdit ? 'Product updated!' : 'Product added!');
                handleBack();
            })
            .catch(() => alert('Something went wrong.'))
            .finally(() => setLoading(false));
    };

    return (
        <div className="product-form-container">
            <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
            <form className="product-form" onSubmit={handleSubmit}>
                <label>Name</label>
                <input name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <div className="error">{errors.name}</div>}

                <label>Price</label>
                <input name="price" value={formData.price} onChange={handleChange} />
                {errors.price && <div className="error">{errors.price}</div>}

                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="">--Select--</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Books">Books</option>
                </select>

                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} />

                <div className="form-buttons">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Submit'}
                    </button>
                    <button type="button" className="cancel" onClick={handleBack}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
