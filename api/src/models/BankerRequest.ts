import * as API from './api';

interface BankerRequest {
    id: string;
    bankerId: string;
    clientId: string;
    status: API.BankerRequestStatus;
}

export default BankerRequest;