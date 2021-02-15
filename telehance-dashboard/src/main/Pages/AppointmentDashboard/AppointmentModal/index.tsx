import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import AppointmentModal from "Pages/AppointmentDashboard/AppointmentModal/AppointmentModal";
import classes from './AppointmentModal.module.css'
import styles from "./AppointmentModal.module.css";
import "react-datepicker/dist/react-datepicker.css"

export default function ScheduleAppointment() {
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const onBook = (date: Date) =>{
        console.log(date);
    }
    return (
        <div className={classes.container}>
            <Button variant="primary" onClick={() => setShowAppointmentModal(true)}>
                Schedule Appointment
            </Button>
            <AppointmentModal show={showAppointmentModal}
                              onConfirm={(date: Date) => {
                                  onBook(date);
                                  setShowAppointmentModal(false);
                              }}
                              onCancel={() => setShowAppointmentModal(false)}/>
        </div>
    );
}
