import React, { Fragment, useState } from "react";
import axios from "axios";

export const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // TODO solve protocol error
    /* const onSubmit = async(e) => {
        e.preventDefault()

        try {
            const user = {
                email,
                password
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const body = JSON.stringify(user)
            let res = await axios.post('https://localhost:5000/api/auth', body, config)
            console.log(res)
        } catch(err) {
            console.log(err)
        }
    } */

    return (
        <Fragment>
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead">
            <i className="fas fa-user"></i> Sign into Your Account
        </p>
        <form className="form" action="dashboard.html" /* onSubmit={e => onSubmit(e)} */>
            <div className="form-group">
            <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={(e) => onChange(e)}
                required
            />
            </div>
            <div className="form-group">
            <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => onChange(e)}
            />
            </div>
            <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        </Fragment>
  );
};

export default Login;
