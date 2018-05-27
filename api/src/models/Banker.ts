import * as API from './api';

interface Banker {
    id: string;
    name: string;
    specialty: string;
    status: API.BankerStatus;
}

export default Banker;