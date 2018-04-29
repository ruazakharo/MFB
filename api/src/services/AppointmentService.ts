import ReasonDAO from '../dao/ReasonDAO';
import OfficeDAO from '../dao/OfficeDAO';

export function getOffices() {
    return OfficeDAO.getMany({});
}

export function getReasons() {
    return ReasonDAO.getMany({});
}