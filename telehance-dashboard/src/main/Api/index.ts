export const DEFAULT_PROTOCOL = 'https';
export const DEFAULT_REGION = 'us-west-2';
export const DEFAULT_STAGE = 'dev';

export const API_Info = {
  appointment: { id: 'klnb89q4vj' },
  consult: { id: '53q2e7vhgl' },
  consultWebsocket: { id: 'f26oedtlj3', protocol: 'wss' },
  user: { id: 'qf5ajjc2x6' },
  twilio: { id: '59wncxd6oi' },
} as ApiMapping;

// General Api Url Function

export function getUrl(api: Api, route: string, query?: ApiQuery) {
  const { id, protocol, region, stage } = API_Info[api];

  const queryString = query
    ? `?${Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`
    : '';

  return `${protocol ?? DEFAULT_PROTOCOL}://${id}.execute-api.${
    region ?? DEFAULT_REGION
  }.amazonaws.com/${stage ?? DEFAULT_STAGE}${route}${queryString}`;
}

// Appointment Api

export const addApptUrl = getUrl('appointment', '/addappt');
export const getApptsUrl = (role: string, query: GetUserQuery) =>
  getUrl('appointment', `/by${role}`, query);

// Consult Api

export const getAllConsultsUrl = (query: GetUserQuery) =>
  getUrl('consult', '/consult-get-all', query);
export const getConsultUrl = (query: GetConsultQuery) =>
  getUrl('consult', '/consult-get-by-id', query);
export const updateSymptomsUrl = (query: UpdateSymptomsQuery) =>
  getUrl('consult', '/updateSymptoms', query);
export const updateTranscriptUrl = (query: GetConsultQuery) =>
  getUrl('consult', '/update-transcript-edited', query);
export const diagnoseUrl = getUrl('consult', '/diagnose')
export const adminGraphUrl = getUrl('consult', '/get-graph-data')
// Consult Websocket (Live Consult) Api

export const consultWebsocketUrl = getUrl('consultWebsocket', '/');

// Twilio Api

export const getTwilioTokenUrl = getUrl('twilio', '/get-token');

// User Api

export const getAllDoctorsUrl = getUrl('user', '/doctor-get-all');
export const getAllUsersUrl = getUrl('user', '/user-get-all');
export const getUserUrl = getUrl('user', '/user-by-id');
export const getUserProfileUrl = (query: GetUserQuery) =>
    getUrl('user', '/user-by-id', query);
export const updateUserUrl = getUrl('user', '/update-phone');

// Type Definitions

export type Api =
  | 'appointment'
  | 'consult'
  | 'consultWebsocket'
  | 'twilio'
  | 'user';

export type ApiMapping = {
  [key in Api]: {
    id: string;
    protocol?: string;
    region?: string;
    stage?: string;
  };
};

export type ApiQuery = { [key: string]: string | number };
export type UpdateSymptomsQuery = {
  consult_id: string;
  start_time: number;
};
export type GetUserQuery = {
  user_id: string;
};
export type GetConsultQuery = {
  consult_id: string;
};
