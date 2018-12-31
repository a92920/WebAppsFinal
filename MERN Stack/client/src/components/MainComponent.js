import React, { Component } from 'react';
import Home from './HomeComponent';

import Exercises from './ExerciseComponent';
import Attendances from './AttendanceComponent';

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import ExerciseDetail from './ExerciseDetailComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { postGrade, fetchExercise, fetchGrades, fetchalos, fetchattendance, postFeedback } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapStoreToProps = state => {
    return {
      fetchexercisees: state.fetchexercisees,
      grades: state.grades,
      alos: state.alos,
      attendance: state.attendance
    }
}

const mapDispatchToProps = dispatch => ({
  postGrade: (fetchexerciseId, grade, student) => dispatch(postGrade(fetchexerciseId, grade, student)),
  fetchExercise: () => {dispatch(fetchExercise())},
  resetFeedbackForm: () => { dispatch(actions.reset('feedback'))},
  fetchGrades: () => dispatch(fetchGrades()),
  fetchalos: () => dispatch(fetchalos()),
  fetchattendance: () => dispatch(fetchattendance()),
  postFeedback: (feedback) => dispatch(postFeedback(feedback))
});

class Main extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchExercise();
    this.props.fetchGrades();
    this.props.fetchalos();
    this.props.fetchattendance();
  }

  render() {

    const HomePage = () => {
      return(
        <Home
          fetchexercise={this.props.fetchexercisees.fetchexercisees.filter((fetchexercise) => fetchexercise.featured)[0]}
          fetchexerciseesLoading={this.props.fetchexercisees.isLoading}
          fetchexerciseesErrMess={this.props.fetchexercisees.errMess}
          alo={this.props.alos.alos.filter((alo) => alo.featured)[0]}
          aloLoading={this.props.alos.isLoading}
          aloErrMess={this.props.alos.errMess}
          leader={this.props.attendance.attendance.filter((leader) => leader.featured)[0]}
          attendanceLoading={this.props.attendance.isLoading}
          attendanceErrMess={this.props.attendance.errMess}
        />
      );
    }

   
    const ExerciseWithId = ({match}) => {
      return(
        <ExerciseDetail fetchexercise={this.props.exercises.exercises.filter((exercise) => exercise.id === parseInt(match.params.exerciseId,10))[0]}
          isLoading={this.props.exercises.isLoading}
          errMess={this.props.exercises.errMess}
          grades={this.props.studentgrade.studentgrade.filter((studentgrade) => studentgrade.exerciseId === parseInt(match.params.exerciseId,10))}
          studentgradeErrMess={this.props.studentgrade.errMess}
          postStudentGrade={this.props.postStudentGrade}
        />
      );
    };
    const AttendanceWithId = ({match}) => {
      return(
        <ExerciseDetail fetchexercise={this.props.attendances.attendances.filter((attendance) => attendance.id === parseInt(match.params.attendanceId,10))[0]}
          isLoading={this.props.attendances.isLoading}
          errMess={this.props.attendances.errMess}
          attendancesheet={this.props.studentattendance.studentattendance.filter((studentattendance) => studentattendance.attendanceId === parseInt(match.params.attendanceId,10))}
          studentattendanceErrMess={this.props.studentattendance.errMess}
          postStudentAttendance={this.props.postStudentAttendance}
        />
      );
    };

    return (
      <div>
        <Header />
        <TransitionGroup>
            <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
              <Switch location={this.props.location}>
                  <Route path='/home' component={HomePage} />
                  
                  <Route exact path='/exercises' component={() => <Exercises exercises={this.props.exercises} />} />
                  <Route path='/exercises/:exerciseId' component={ExerciseWithId} />
                  <Route exact path='/attendances' component={() => <Attendances attendances={this.props.attendances} />} />
                  <Route path='/attendances/:aloId' component={AttendanceWithId} />
                  <Redirect to="/home" />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(Main));
