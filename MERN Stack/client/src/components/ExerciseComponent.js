import React from 'react';
import { Card, CardImgOverlay, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';


function RenderExercisesItem({exercise, onClick}) {
    return(
        <Card>
            <Link to={`/exercises/${exercise.id}`}>
                
                <CardImgOverlay>
                    <CardTitle><strong>{exercise.name}</strong></CardTitle>
                    <CardTitle><strong>{exercise.description}</strong></CardTitle>
                    <CardTitle><strong>{exercise.duedate}</strong></CardTitle>
                    <CardTitle><strong>{exercise.MaxGrade}</strong></CardTitle>

                </CardImgOverlay>
            </Link>
        </Card>
    );
}
const Exercises = (props) => {
    const exercises = props.exercises.exercises.map((exercise) => {
        return (
            <div key={exercise.id} className="col-12 col-md-5 m-1">
                <RenderExercisesItem exercise={exercise} />
            </div>
        );
    });
    if (props.exercises.isLoading) {
        return(
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    } else if (props.exercises.errMess) {
        return(
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h4>{props.exercises.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Exercises</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>Exercises</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    {exercises}
                </div>
                <div className="row">

                </div>
            </div>
        );
    }
}
export default Exercises;
