import * as API from './api';

interface BankerRequest {
    id: string;
    createdOn: number;
    bankerId: string;
    clientId: string;
    status: API.BankerRequestStatus;
}

export default BankerRequest;