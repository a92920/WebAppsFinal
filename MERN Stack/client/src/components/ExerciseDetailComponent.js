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
class StudentGradeForm extends Component {
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
        this.props.postStudentGrade(this.props.exerciseId, values.grade, values.studentname, values.studentgrade);
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
                <span className="fa fa-pencil fa-lg"></span> Submit StudentGrade
            </Button>

            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader>Submit StudentGrade</ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                        <Row className="form-group">
                            <Label htmlFor="grade" className="ml-3">grade</Label>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor="student" className="ml-3">Student Name</Label>
                                <Col md={12}>
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
                            <Label htmlFor="yourname" className="ml-3">StudentGrade</Label>
                                <Col md={12}>
                                    <Control.textarea model=".studentgrade" id="studentgrade"
                                        name="studentgrade" placeholder="StudentGrade"
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

function RenderExercise({exercise}) {
    if (exercise!=null){
        return(
            <div className="col-12 col-md-5 m-1">
                <FadeTransform in
                    transformProps={{
                        exitTransform: 'scale(0.5) translateY(-50%)' }}>
                    <Card>
                        <CardImg top src={baseUrl + exercise.image} alt={exercise.name} />
                        <CardBody>
                            <CardTitle>{exercise.name}</CardTitle>
                            <CardText>{exercise.description}</CardText>
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

function RenderStudentGrades({studentgrades, postStudentGrade, exerciseId}) {
    if(studentgrades != null) {
        return (
            <div className="col-12 col-md-5 m-1">
                <h4>StudentGrades</h4>
                <ul className="list-unstyled">
                    <Stagger in>
                        {studentgrades.map((studentgrade) => {
                            return (
                                <Fade in>
                                <li key={studentgrade.id}>
                                <p>{studentgrade.studentgrade}</p>
                                <p>-- {studentgrade.studentname} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(studentgrade.date)))}</p>
                                </li>
                                </Fade>
                            );
                        })}
                    </Stagger>
                </ul>
                <StudentGradeForm exerciseId={exerciseId} postStudentGrade={postStudentGrade} />
            </div>);
    } else {
        return(
            <div></div>
        );
    }
}

const ExerciseDetail = (props) => {
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
    } else if (props.exercise!=null) {
        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/exercises">Exercises</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.exercise.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.exercise.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderExercise exercise={props.exercise} />
                    <RenderStudentGrades studentgrades={props.studentgrades}
                        postStudentGrade={props.postStudentGrade}
                        exerciseId={props.exercise.id} />
                </div>
            </div>
        );
    } else {
        return <div></div>
    }
}

export default ExerciseDetail;
