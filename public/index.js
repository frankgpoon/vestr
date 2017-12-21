import { Nav, Navbar, NavItem, Button, Form, FormGroup, Col, FormControl, Checkbox, ControlLabel } from 'react-bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

var authenticated = false; //will have to change
var name = 'Someone Someone';

/* Header */
class Header extends React.Component {
    render() {
        return(
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>vestr</Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <AccountHeader />
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

// Displays login or logout depending on authentication state.
class AccountHeader extends React.Component {
    render() {
        if (authenticated) {
            return(
                <Nav pullRight>
                    <NavItem eventKey={1} href="/account">My Account</NavItem>
                    <NavItem eventKey={2} href="/logout">Logout</NavItem>
                </Nav>
            );
        } else {
            return(
                <Nav pullRight>
                    <NavItem eventKey={1} href="/account">Register/Login</NavItem>
                </Nav>
            );
        }
    }
}

/* /account GET */

ReactDOM.render(<Header />, document.getElementById('header'));
