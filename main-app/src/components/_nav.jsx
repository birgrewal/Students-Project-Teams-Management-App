import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios'

export default function Nav() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    var [loggedIn, setLoggedIn] = useState();
    const [loggedInUser, setLoggedInUser] = useState();

    const [signUpUsername, setSignUpUsername] = useState();
    const [signUpPassword, setSignUpPassword] = useState();
    const [confirmSignUpPassword, setConfirmSignUpPassword] = useState();
    const [fullName, setFullName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();

    window.addEventListener('load', () => {
        axios.get('http://localhost:3000/loggedin')
            .then((result) => {
                if (result.data) {
                    setLoggedIn(true)
                    setLoggedInUser(result.data)
                    console.log(result.data)
                } else {
                    // setLoggedIn(false)
                    console.log(result.data)
                }
            })
            .catch(err => console.log(err))
    })

    const handleLogin = (e) => {
        axios.post('http://localhost:3000/login', { username, password })
            .then((result) => {
                // console.log(username, password)
                if (result.data == "Login successful") {
                    setLoggedIn(true)
                    setLoggedInUser(username)
                    console.log(result.data)
                } else {
                    console.log(result.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    const handleSignup = (e) => {
        if (signUpPassword == confirmSignUpPassword) {
            axios.post('http://localhost:3000/signup', { signUpUsername, fullName, email, phone, signUpPassword })
                .then((result) => {
                    if (result.data.message == "Signup successful") {
                        console.log("signup success")
                    }
                })
                .catch(err => console.log(err))
        } else {
            console.log('Password not matching')
        }
    }

    const logout = (e) => {
        axios.get('http://localhost:3000/logout')
            .then((result) => {
                console.log(result)
            })
            .catch(err => console.log(err))
    }

    return (<>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Projectopia</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Home</Link>

                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/projects">Projects</Link>
                        </li>
                    </ul>

                    {(loggedIn) ?
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#" onClick={logout}>
                            Logout
                        </button>
                        :
                        <>
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#login">
                                Login
                            </button>
                            <div className="modal fade" id="login" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Login</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="mb-3 row">
                                                <div className="mb-3 row">
                                                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Username</label>
                                                    <div className="col-sm-10">
                                                        <input type="text" className="form-control" id="username" onChange={(e) => { setUsername(e.target.value) }} />
                                                    </div>
                                                </div>
                                                <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
                                                <div className="col-sm-10">
                                                    <input type="password" className="form-control" id="inputPassword" onChange={(e) => { setPassword(e.target.value) }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={handleLogin}>Login</button>
                                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signup">
                                                Create Account</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signup">
                                Signup
                            </button>
                        </>}



                    <div className="modal fade" id="signup" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Signup</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3 row">
                                        <div className="mb-3 row">
                                            <label htmlFor="fullName" className="col-sm-2 col-form-label">Name</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="fullName" onChange={(e) => setFullName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label htmlFor="phone" className="col-sm-2 col-form-label">Phone</label>
                                            <div className="col-sm-10">
                                                <input type="phone" className="form-control" id="phone" onChange={(e) => setPhone(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label htmlFor="email" className="col-sm-2 col-form-label">Email Address</label>
                                            <div className="col-sm-10">
                                                <input type="email" className="form-control" id="email" onChange={(e) => setEmail(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label htmlFor="signupUsername" className="col-sm-2 col-form-label">Username</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="signupUsername" onChange={(e) => setSignUpUsername(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label htmlFor="signUpPassword" className="col-sm-2 col-form-label">Password</label>
                                            <div className="col-sm-10">
                                                <input type="password" className="form-control" id="signupPassword" onChange={(e) => setSignUpPassword(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label htmlFor="confirmSignupPassword" className="col-sm-2 col-form-label">Confirm Password</label>
                                            <div className="col-sm-10">
                                                <input type="password" className="form-control" id="confirmSignupPassword" onChange={(e) => setConfirmSignUpPassword(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={handleSignup}>Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </nav >


    </>
    )
}