import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import {DropdownButton, Modal} from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import classes from './AppointmentModal.module.css'
import {setMinutes, setHours} from "date-fns";
import styles from "./AppointmentModal.module.css";
import {faCalendarAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DropdownItem from "react-bootstrap/DropdownItem";
import useSWR from "swr";
import {fetchWithToken} from "Util/fetch";

const AppointmentModal = ({
                              show,
                              onConfirm,
                              onCancel,
                          }: AppointmentModalProps) => {
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const userToken = process.env.REACT_APP_USER_API_KEY;
    const { data: doctorList, error } = useSWR<doctor_info[]>(
        [
            "https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/doctor-get-all",
            userToken,
        ],
        fetchWithToken
    );
    console.log(doctorList);
    return(
        <>
            <Modal
                show={show}
                onHide={onCancel}>
                <Modal.Header
                    closeButton>
                    <Modal.Title>Schedule an Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles["form-group"]}>
                        <label>Doctor</label>
                        <br/>
                        {doctorList &&
                            <DropdownButton id="dropdown-item-button" title="Doctors">
                                {
                                    doctorList.map((doctor) => (
                                        <DropdownItem>{doctor.given_name}</DropdownItem>
                                    ))
                                }
                            </DropdownButton>
                        }
                        <br/>
                        <label>Date and Time</label>
                        <br/>
                        <DatePicker
                            selected={appointmentDate}
                            onChange={(d: Date) => setAppointmentDate(d)}
                            showTimeSelect
                            timeFormat="h:mm aa"
                            timeIntervals={30}
                            timeCaption="time"
                            minTime={setMinutes(appointmentDate, 0)}
                            maxTime={setHours(setMinutes(appointmentDate, 0), 17)}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            customInput={
                                <input type="date and time" className={styles["form-control"]} />
                            }
                            className={styles["date-picker"]}
                        />
                    </div>
                    <div className={styles["form-group"]}>
                        <label>Purpose of Appointment</label>
                        <input type="age" className={styles["form-control"]} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={()=>{
                            onConfirm(appointmentDate)
                        }}>
                        Schedule
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export type AppointmentModalProps = {
    show: boolean;
    onConfirm: (d: Date) => void;
    onCancel: () => void;
};

export type doctor_info = {
    user_id: string,
    family_name: string,
    given_name: string,
    picture: string,
}

export default AppointmentModal;
