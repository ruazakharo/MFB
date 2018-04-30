// WARNING, THIS IS GENERATED FILE, DO NOT CHANGE

export interface Error {
    message: string;
}

export type PhoneNumber = string;

export interface AppointmentReason {
    id: string;
    text: string;
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
    FINISHED = <any>'FINISHED'
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
    ad?: SignageAdvertisment;
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

