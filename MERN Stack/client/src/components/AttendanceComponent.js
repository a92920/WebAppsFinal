import React from 'react';
import { Card, CardImgOverlay, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';


function RenderAttendancesItem({attendance, onClick}) {
    return(
        <Card>
            <Link to={`/attendances/${attendance.id}`}>
                
                <CardImgOverlay>
                    <CardTitle><strong>{attendance.date}</strong></CardTitle>
                    <CardTitle><strong>{attendance.alo}</strong></CardTitle>
                   

                </CardImgOverlay>
            </Link>
        </Card>
    );
}
const Attendances = (props) => {
    const attendances = props.attendances.attendances.map((attendance) => {
        return (
            <div key={attendance.id} className="col-12 col-md-5 m-1">
                <RenderAttendancesItem attendance={attendance} />
            </div>
        );
    });
    if (props.attendances.isLoading) {
        return(
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    } else if (props.attendances.errMess) {
        return(
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h4>{props.attendances.errMess}</h4>
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
                        <BreadcrumbItem active>Attendances</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>Attendances</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    {attendances}
                </div>
                <div className="row">

                </div>
            </div>
        );
    }
}
export default Attendances;
