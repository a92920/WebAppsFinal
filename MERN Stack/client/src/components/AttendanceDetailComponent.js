import React,{Component} from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
class StudentaloForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postStudentalo(this.props.dateId, values.grade, values.studentname, values.studentalo);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    render() {
        return (

            <div>
            <Button outline color="secondary"  onClick={this.toggleModal}>
                <span className="fa fa-pencil fa-lg"></span> Submit Studentalo
            </Button>

            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader>Submit Studentalo</ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                        <Row className="form-group">
                            <Label htmlFor="grade" className="ml-3">grade</Label>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor="student" className="ml-3">Student Name</Label>
                                <Col md={12}>
                                <Label htmlFor="alo" className="ml-3">attendance sheet</Label>
                                <Col md={12}>
                                    <Control.select model=".alo" id="alo" name="alo"
                                        className="form-control">
                                        <option>Absent</option>
                                        <option>Late</option>
                                        <option>On Time</option>
                                    </Control.select>
                                </Col>
                                    <Control.text model=".studentname" id="studentname"
                                        name="studentname" placeholder="student Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }} />
                                    <Errors
                                        className="text-danger"
                                        model=".studentname"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                     />
                                </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor="yourname" className="ml-3">Studentalo</Label>
                                <Col md={12}>
                                    <Control.textarea model=".studentalo" id="studentalo"
                                        name="studentalo" placeholder="Studentalo"
                                        rows="6" className="form-control" />
                                </Col>
                        </Row>
                        <Row className="form-group">
                            <Col>
                                <Button type="submit" color="primary">
                                Submit
                                </Button>
                            </Col>
                        </Row>
                    </LocalForm>
                </ModalBody>
            </Modal>
            </div>
        );
    }
}

function Renderdate({date}) {
    if (date!=null){
        return(
            <div className="col-12 col-md-5 m-1">
                <FadeTransform in
                    transformProps={{
                        exitTransform: 'scale(0.5) translateY(-50%)' }}>
                    <Card>
                        <CardImg top src={baseUrl + date.image} alt={date.name} />
                        <CardBody>
                            <CardTitle>{date.name}</CardTitle>
                            <CardText>{date.description}</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>
            </div>
        );
    } else {
        return(
            <div></div>
        );
    }
}

function RenderStudentalos({studentalos, postStudentalo, dateId}) {
    if(studentalos != null) {
        return (
            <div className="col-12 col-md-5 m-1">
                <h4>Studentalos</h4>
                <ul className="list-unstyled">
                    <Stagger in>
                        {studentalos.map((studentalo) => {
                            return (
                                <Fade in>
                                <li key={studentalo.id}>
                                <p>{studentalo.studentalo}</p>
                                <p>-- {studentalo.studentname} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(studentalo.date)))}</p>
                                </li>
                                </Fade>
                            );
                        })}
                    </Stagger>
                </ul>
                <StudentaloForm dateId={dateId} postStudentalo={postStudentalo} />
            </div>);
    } else {
        return(
            <div></div>
        );
    }
}

const dateDetail = (props) => {
    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    } else if (props.errMess) {
        return(
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    } else if (props.date!=null) {
        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/dates">dates</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.date.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.date.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <Renderdate date={props.date} />
                    <RenderStudentalos studentalos={props.studentalos}
                        postStudentalo={props.postStudentalo}
                        dateId={props.date.id} />
                </div>
            </div>
        );
    } else {
        return <div></div>
    }
}

export default dateDetail;
