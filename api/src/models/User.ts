import * as API from './api';

interface User {
    id: string;
    name: string;
    phoneNumber: string;
    presence: API.ClientPresence;
}

export default User;