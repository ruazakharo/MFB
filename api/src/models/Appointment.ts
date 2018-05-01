import * as API from './api';

interface Appointment {
    id: string;
    userId: string;
    createdOn: number;
    status: API.AppointmentStatus;
    reasonId: string;
    officeId: string;
    date: string;
    time: string;
}

export default Appointment;