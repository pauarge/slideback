import React, {Component} from 'react';
import {Button, Form} from "react-bootstrap";

class Comments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            textData: '',
            comments: [],
        }

        this.socket = props.socket;

    }

    handleChange(event) {
        this.setState({
            textData: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        const comments = this.state.comments;
        comments.push(this.state.textData);
        this.setState({
            textData: '',
            comments
        })
        this.socket.emit('newComment', this.state.textData);
    }

    render() {
        return (
            <div>
                <Form onSubmit={e => this.handleSubmit(e)}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Doubts</Form.Label>
                        <Form.Control type="text" placeholder="Submit your doubts" value={this.state.textData}
                        onChange={e => this.handleChange(e)}/>
                    </Form.Group>
                    <Button type="submit">Submit form</Button>

                </Form>

                <br></br>

                <div className="comment">
                    {this.state.comments.map(comment => {
                        return <p>{comment}</p>
                    })}
                </div>
            </div>

        );
    }
}

export default Comments;
