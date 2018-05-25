// WARNING, THIS IS GENERATED FILE, DO NOT CHANGE

export interface Error {
    message: string;
}

export type PhoneNumber = string;

export interface AppointmentReason {
    id: string;
    text: string;
    isPersonalService: boolean;
}

export interface SignupRequest {
    name: string;
    appointmentReasonId?: string;
    phoneNumber: PhoneNumber;
}

export interface SigninRequest {
    phoneNumber: PhoneNumber;
}

export interface SigninResponse {
    token: string;
}

export interface AppointmentOffice {
    id: string;
    name: string;
    address: string;
    location: Location;
    openTime: string;
}

export interface Location {
    longitude: number;
    latitude: number;
}

export interface AppointmentRequest {
    reasonId: string;
    officeId: string;
}

export interface Appointment {
    id: string;
    status: AppointmentStatus;
    reason: AppointmentReason;
    office: AppointmentOffice;
    date: string;
    time?: string;
}

export enum AppointmentStatus {
    ASSIGNED = <any>'ASSIGNED',
    CHECKED_IN = <any>'CHECKED_IN',
    IN_SERVICE = <any>'IN_SERVICE',
    FINISHED = <any>'FINISHED',
    CANCELLED = <any>'CANCELLED'
}

export interface UserInfo {
    name: string;
    phoneNumber: PhoneNumber;
    currentAppointment?: Appointment;
}

export interface AppointmentQueue {
    clients: AppointmentQueueClient[];
}

export interface AppointmentQueueClient {
    id: string;
    window?: string;
    isCurrentUser?: boolean;
}

export interface SignageIdentificationRequest {
    phoneNumber: PhoneNumber;
}

export interface SignageIdentification {
    client?: SignageIdentificationClient;
    ads: SignageAdvertisment[];
}

export interface SignageIdentificationClient {
    name: string;
    phoneNumber: PhoneNumber;
}

export interface SignageAdvertisment {
    id: string;
    shortText: string;
    fullText: string;
    pictureUrl: string;
}

export interface ClientPresence {
    updatedOn?: number;
    bank?: boolean;
    signage?: boolean;
}

export interface ClientInfo {
    id: string;
    name: string;
    phoneNumber: PhoneNumber;
    presence: ClientPresence;
    currentAppointment?: Appointment;
}

export enum BankerStatus {
    READY = <any>'READY',
    BUSY = <any>'BUSY',
    OFFLINE = <any>'OFFLINE'
}

export interface BankerInfo {
    id: string;
    name: string;
    specialty: string;
    status: BankerStatus;
}

export enum BankerRequestStatus {
    PENDING = <any>'PENDING',
    BUSY = <any>'BUSY',
    READY = <any>'READY',
    READY_LATER = <any>'READY_LATER',
    FINISHED = <any>'FINISHED'
}

export interface BankerRequest {
    id?: string;
    bankerId: string;
    clientId: string;
    status: BankerRequestStatus;
}

export enum EventType {
    CLIENT_AT_SIGNAGE = <any>'CLIENT_AT_SIGNAGE',
    BANKER_REQUEST = <any>'BANKER_REQUEST',
    BANKER_REQUEST_RESPONSE = <any>'BANKER_REQUEST_RESPONSE'
}

export interface Event {
    id: string;
    type: EventType;
    clientInfo?: ClientInfo;
    bankerRequest?: BankerRequest;
}

