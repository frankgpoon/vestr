import { Nav, Navbar, NavItem, Button, Form, FormGroup, Col, FormControl, Checkbox, ControlLabel } from 'react-bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

var authenticated = false; //will have to change
var name = 'Someone Someone';

class AccountManager extends React.Component {
    render() {
        if (authenticated) {
            return(<div></div>);
        } else {
            return (
                <div>
                    <LoginForm />
                    <RegisterForm />
                </div>
            );
        }
    }
}

class LoginForm extends React.Component {
    render() {
        return(
            <div>
                <Col md={3} mdOffset={3} xs={10} xsOffset={1}>
                    <Form horizontal action="/login" method="POST">
                            <h3>Login to vestr</h3>
                            <FormGroup>
                                <Col xs={10}>
                                    <ControlLabel>Email</ControlLabel>
                                    <FormControl type="email" placeholder="Email" name="email" />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col xs={10}>
                                    <ControlLabel>
                                    Password</ControlLabel>
                                    <FormControl type="password" placeholder="Password" name="password" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlID="remember">
                                <Col xs={10}>
                                    <Checkbox>Remember me</Checkbox>
                                </Col>
                            </FormGroup>
                            <Button bsStyle="primary" type="submit">Login</Button>
                    </Form>
                </Col>
            </div>
        );
    }
}

class RegisterForm extends React.Component {
    render() {
        return(
            <div>
                <Col md={4} mdOffset={0} xs={10} xsOffset={1}>
                    <Form horizontal action="/register" method="POST">
                            <h3>Register</h3>
                            <FormGroup>
                                <Col xs={10}>
                                    <ControlLabel>First Name</ControlLabel>
                                    <FormControl type="text" placeholder="Name" name="name" />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col xs={10}>
                                    <ControlLabel>Email</ControlLabel>
                                    <FormControl type="email" placeholder="Email" name="email" />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col xs={10}>
                                    <ControlLabel>Password</ControlLabel>
                                    <FormControl type="password" placeholder="Password" name="password" />
                                </Col>
                            </FormGroup>
                            <Button bsStyle="primary" type="submit">Register</Button>
                    </Form>
                </Col>
            </div>
        );
    }
}


ReactDOM.render(<AccountManager />, document.getElementById('account-manager'))
